import { GameBoard, GameState, MOVE_DIRECTION } from '@/types/game';
import { GAME_CONFIG } from './game-constants';

export const GAME_BOARD_SIZE = GAME_CONFIG.BOARD_SIZE;

export function generateEmptyBoard(): GameBoard {
  return Array.from({ length: GAME_BOARD_SIZE }, () => Array(GAME_BOARD_SIZE).fill(0));
}

export function getInitialGameState(): GameState {
  let newBoard = generateEmptyBoard();
  newBoard = placeRandomTile(newBoard).board;
  newBoard = placeRandomTile(newBoard).board;

  return {
    board: newBoard,
    score: 0,
    isGameOver: false,
    isWon: false,
  };
}

export function placeRandomTile(board: GameBoard): {
  board: GameBoard;
  newTile?: { x: number; y: number; value: number };
} {
  const emptyTiles: [number, number][] = [];

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (board[y][x] === 0) {
        emptyTiles.push([y, x]);
      }
    }
  }

  if (emptyTiles.length === 0) {
    return { board };
  }

  const [y, x] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  const newBoard = board.map((row) => [...row]);

  const newValue =
    Math.random() < GAME_CONFIG.TILE_PROBABILITIES.TWO ? GAME_CONFIG.TILE_VALUES.TWO : GAME_CONFIG.TILE_VALUES.FOUR;
  newBoard[y][x] = newValue;

  return {
    board: newBoard,
    newTile: { x, y, value: newValue },
  };
}

export function checkIsWon(board: GameBoard): boolean {
  return board.some((row) => row.includes(GAME_CONFIG.WIN_VALUE));
}

export function checkIsGameOver(board: GameBoard): boolean {
  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      const currentTile = board[y][x];

      if (
        currentTile === 0 ||
        (x < GAME_BOARD_SIZE - 1 && currentTile === board[y][x + 1]) ||
        (y < GAME_BOARD_SIZE - 1 && currentTile === board[y + 1][x])
      ) {
        return false;
      }
    }
  }

  return true;
}

export interface TileMovement {
  oldX: number;
  oldY: number;
  newX: number;
  newY: number;
  value: number;
  merged: boolean;
  mergedValue?: number;
}

export function move(
  board: GameBoard,
  direction: MOVE_DIRECTION
): {
  newBoard: GameBoard;
  gainedScore: number;
  isMoved: boolean;
  movements: TileMovement[];
} {
  const movements: TileMovement[] = [];
  let gainedScore = 0;

  const { lines, mapIdx, reverseOutput } = extractLines(board, direction);

  const newLines = lines.map((line, lineIndex) =>
    processLine(line, lineIndex, mapIdx, (score) => (gainedScore += score), movements)
  );

  const newBoard = assembleBoard(newLines, direction, GAME_BOARD_SIZE, reverseOutput);
  const isMoved = !areBoardsEqual(board, newBoard);

  return {
    newBoard,
    gainedScore,
    isMoved,
    movements,
  };
}

function extractLines(
  board: GameBoard,
  direction: MOVE_DIRECTION
): {
  lines: number[][];
  mapIdx: (lineIdx: number, posIdx: number) => { x: number; y: number };
  reverseOutput: boolean;
} {
  const size = board.length;
  const lines: number[][] = [];
  let mapIdx: (lineIdx: number, posIdx: number) => { x: number; y: number };
  let reverseOutput = false;

  if (direction === MOVE_DIRECTION.LEFT || direction === MOVE_DIRECTION.RIGHT) {
    for (let y = 0; y < size; y++) {
      lines.push(board[y].slice());
    }
    mapIdx = (lineIdx, posIdx) =>
      direction === MOVE_DIRECTION.LEFT ? { x: posIdx, y: lineIdx } : { x: size - 1 - posIdx, y: lineIdx };

    if (direction === MOVE_DIRECTION.RIGHT) {
      lines.forEach((line) => line.reverse());
      reverseOutput = true;
    }
  } else {
    for (let x = 0; x < size; x++) {
      lines.push(board.map((row) => row[x]));
    }
    mapIdx = (lineIdx, posIdx) =>
      direction === MOVE_DIRECTION.UP ? { x: lineIdx, y: posIdx } : { x: lineIdx, y: size - 1 - posIdx };

    if (direction === MOVE_DIRECTION.DOWN) {
      lines.forEach((line) => line.reverse());
      reverseOutput = true;
    }
  }

  return { lines, mapIdx, reverseOutput };
}

function processLine(
  line: number[],
  lineIndex: number,
  mapIdx: (lineIdx: number, posIdx: number) => { x: number; y: number },
  addScore: (score: number) => void,
  movements: TileMovement[]
): number[] {
  const size = line.length;
  const newLine: number[] = [];
  const mergedFlags = new Array(size).fill(false);

  for (let i = 0; i < size; i++) {
    const value = line[i];
    if (value === 0) continue;

    if (newLine.length > 0 && newLine[newLine.length - 1] === value && !mergedFlags[newLine.length - 1]) {
      const mergedValue = value * 2;
      newLine[newLine.length - 1] = mergedValue;
      mergedFlags[newLine.length - 1] = true;
      addScore(mergedValue);

      const source = mapIdx(lineIndex, i);
      const target = mapIdx(lineIndex, newLine.length - 1);

      movements.push({
        oldX: source.x,
        oldY: source.y,
        newX: target.x,
        newY: target.y,
        value,
        merged: true,
        mergedValue,
      });
    } else {
      const targetIndex = newLine.length;
      newLine.push(value);

      const source = mapIdx(lineIndex, i);
      const target = mapIdx(lineIndex, targetIndex);

      movements.push({
        oldX: source.x,
        oldY: source.y,
        newX: target.x,
        newY: target.y,
        value,
        merged: false,
      });
    }
  }

  while (newLine.length < size) {
    newLine.push(0);
  }

  return newLine;
}

function assembleBoard(newLines: number[][], direction: MOVE_DIRECTION, size: number, reverse: boolean): GameBoard {
  const board: GameBoard = Array.from({ length: size }, () => new Array(size).fill(0));

  const lines = reverse ? newLines.map((l) => [...l].reverse()) : newLines;

  if (direction === MOVE_DIRECTION.LEFT || direction === MOVE_DIRECTION.RIGHT) {
    lines.forEach((line, y) => {
      board[y] = line;
    });
  } else {
    lines.forEach((line, x) => {
      line.forEach((val, y) => {
        board[y][x] = val;
      });
    });
  }

  return board;
}

function areBoardsEqual(a: GameBoard, b: GameBoard): boolean {
  return a.every((row, y) => row.every((val, x) => val === b[y][x]));
}
