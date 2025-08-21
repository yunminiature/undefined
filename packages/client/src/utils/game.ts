import { GameBoard, GameState, MOVE_DIRECTION } from '@/types/game';
import { GAME_CONFIG } from './game-constants';

export const GAME_BOARD_SIZE = GAME_CONFIG.BOARD_SIZE;

export function generateEmptyBoard(): GameBoard {
  return Array.from({ length: GAME_BOARD_SIZE }, () => Array(GAME_BOARD_SIZE).fill(0));
}

export function getInitialGameState(): GameState {
  // let newBoard = generateEmptyBoard();
  // newBoard = placeRandomTile(newBoard);
  const newBoard = [
    [2, 2, 2, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 2, 0, 2],
  ];

  return {
    board: newBoard,
    score: 0,
    isGameOver: false,
    isWon: false,
  };
}

export function placeRandomTile(board: GameBoard): GameBoard {
  const emptyTiles: [number, number][] = [];

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (board[y][x] === 0) {
        emptyTiles.push([y, x]);
      }
    }
  }

  if (emptyTiles.length === 0) {
    return board;
  }

  const [y, x] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  const newBoard = board.map((row) => [...row]);

  newBoard[y][x] =
    Math.random() < GAME_CONFIG.TILE_PROBABILITIES.TWO ? GAME_CONFIG.TILE_VALUES.TWO : GAME_CONFIG.TILE_VALUES.FOUR;

  return newBoard;
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
  const rotated = rotateBoard(board, direction);
  let isMoved = false;
  let gainedScore = 0;
  const movements: TileMovement[] = [];

  const originalPositions: { x: number; y: number; value: number }[] = [];
  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (rotated[y][x] !== 0) {
        originalPositions.push({ x, y, value: rotated[y][x] });
      }
    }
  }

  const usedPositions = new Set<string>();

  const newBoard = rotated.map((row, rowIndex) => {
    const newRow = [...row].filter((v) => v !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        const mergedValue = newRow[i] * 2;
        gainedScore += mergedValue;

        const tile1Pos = originalPositions.find(
          (pos) => pos.value === newRow[i] && !usedPositions.has(`${pos.x},${pos.y}`)
        );

        const tile2Pos = originalPositions.find(
          (pos) =>
            pos.value === newRow[i + 1] &&
            !usedPositions.has(`${pos.x},${pos.y}`) &&
            (pos.x !== tile1Pos?.x || pos.y !== tile1Pos?.y)
        );

        if (tile1Pos && tile2Pos) {
          usedPositions.add(`${tile1Pos.x},${tile1Pos.y}`);
          usedPositions.add(`${tile2Pos.x},${tile2Pos.y}`);

          movements.push({
            oldX: tile1Pos.x,
            oldY: tile1Pos.y,
            newX: i,
            newY: rowIndex,
            value: newRow[i],
            merged: true,
            mergedValue,
          });

          movements.push({
            oldX: tile2Pos.x,
            oldY: tile2Pos.y,
            newX: i,
            newY: rowIndex,
            value: newRow[i + 1],
            merged: true,
            mergedValue,
          });
        }

        newRow[i] = mergedValue;
        newRow[i + 1] = 0;
      }
    }

    const merged = newRow.filter((v) => v !== 0);

    merged.forEach((value, newIndex) => {
      const originalPos = originalPositions.find(
        (pos) => pos.value === value && !usedPositions.has(`${pos.x},${pos.y}`)
      );

      if (originalPos && (originalPos.x !== newIndex || originalPos.y !== rowIndex)) {
        const alreadyTracked = movements.some(
          (m) => m.oldX === originalPos.x && m.oldY === originalPos.y && m.value === value
        );

        if (!alreadyTracked) {
          usedPositions.add(`${originalPos.x},${originalPos.y}`);

          movements.push({
            oldX: originalPos.x,
            oldY: originalPos.y,
            newX: newIndex,
            newY: rowIndex,
            value,
            merged: false,
          });
        }
      }
    });

    while (merged.length < GAME_BOARD_SIZE) {
      merged.push(0);
    }

    if (!isArraysEqual(merged, row)) {
      isMoved = true;
    }

    return merged;
  });

  const restored = restoreBoard(newBoard, direction);

  const restoredMovements = movements.map((movement) => {
    const oldCoords = restoreCoordinates(movement.oldX, movement.oldY, direction, GAME_BOARD_SIZE);
    const newCoords = restoreCoordinates(movement.newX, movement.newY, direction, GAME_BOARD_SIZE);

    return {
      ...movement,
      oldX: oldCoords[0],
      oldY: oldCoords[1],
      newX: newCoords[0],
      newY: newCoords[1],
    };
  });

  return { newBoard: restored, gainedScore, isMoved, movements: restoredMovements };
}

export function getTileMovements(board: GameBoard, direction: MOVE_DIRECTION): TileMovement[] {
  const { movements } = move(board, direction);
  return movements;
}

function isArraysEqual(a: number[], b: number[]): boolean {
  return a.every((val, idx) => val === b[idx]);
}

function rotateBoard(board: GameBoard, dir: MOVE_DIRECTION): GameBoard {
  const rotated = generateEmptyBoard();

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (dir === MOVE_DIRECTION.LEFT) {
        rotated[y][x] = board[y][x];
      } else if (dir === MOVE_DIRECTION.RIGHT) {
        rotated[y][x] = board[y][GAME_BOARD_SIZE - 1 - x];
      } else if (dir === MOVE_DIRECTION.UP) {
        rotated[y][x] = board[x][y];
      } else if (dir === MOVE_DIRECTION.DOWN) {
        rotated[y][x] = board[GAME_BOARD_SIZE - 1 - x][y];
      }
    }
  }

  return rotated;
}

export function restoreCoordinates(x: number, y: number, dir: MOVE_DIRECTION, size: number): [number, number] {
  if (dir === MOVE_DIRECTION.LEFT) {
    return [x, y];
  } else if (dir === MOVE_DIRECTION.RIGHT) {
    return [size - 1 - x, y];
  } else if (dir === MOVE_DIRECTION.UP) {
    return [y, x];
  } else if (dir === MOVE_DIRECTION.DOWN) {
    return [y, size - 1 - x];
  }
  return [x, y];
}

function restoreBoard(board: GameBoard, dir: MOVE_DIRECTION): GameBoard {
  const restored = generateEmptyBoard();

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (dir === MOVE_DIRECTION.LEFT) {
        restored[y][x] = board[y][x];
      } else if (dir === MOVE_DIRECTION.RIGHT) {
        restored[y][x] = board[y][GAME_BOARD_SIZE - 1 - x];
      } else if (dir === MOVE_DIRECTION.UP) {
        restored[x][y] = board[y][x];
      } else if (dir === MOVE_DIRECTION.DOWN) {
        restored[GAME_BOARD_SIZE - 1 - x][y] = board[y][x];
      }
    }
  }

  return restored;
}
