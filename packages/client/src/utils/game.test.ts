import { GameBoard, MOVE_DIRECTION } from '@/types/game';
import {
  checkIsGameOver,
  checkIsWon,
  GAME_BOARD_SIZE,
  generateEmptyBoard,
  getInitialGameState,
  move,
  placeRandomTile,
} from './game';
import { GAME_CONFIG } from './game-constants';

const withMockedRandom = <T>(seq: number[], fn: () => T): T => {
  const spy = jest.spyOn(Math, 'random');
  let i = 0;
  spy.mockImplementation(() => {
    const v = seq[Math.min(i, seq.length - 1)];
    i++;
    return v;
  });
  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
};

const countNonZero = (b: GameBoard) => b.flat().filter((v) => v !== 0).length;

describe('generateEmptyBoard()', () => {
  it('should return a BOARD_SIZE×BOARD_SIZE matrix filled with zeros', () => {
    const board = generateEmptyBoard();
    expect(board).toHaveLength(GAME_BOARD_SIZE);
    board.forEach((row) => {
      expect(row).toHaveLength(GAME_BOARD_SIZE);
      row.forEach((cell) => expect(cell).toBe(0));
    });
  });

  it('should create independent row arrays (no shared reference)', () => {
    const board = generateEmptyBoard();
    expect(board[0]).not.toBe(board[1]);
  });

  it('should not affect other rows when mutating one row', () => {
    const board = generateEmptyBoard();
    board[0][0] = 1;
    expect(board[1][0]).toBe(0);
  });
});

describe('getInitialGameState()', () => {
  it('should initialize with two tiles, score=0, isGameOver=false, isWon=false', () => {
    const state = withMockedRandom([0, 0, 0.5, 0.5], () => getInitialGameState());
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
    expect(state.isWon).toBe(false);
    expect(countNonZero(state.board)).toBe(2);
  });
});

describe('placeRandomTile()', () => {
  it('should return the same board when no empty cells exist', () => {
    const full: GameBoard = Array.from({ length: GAME_BOARD_SIZE }, () =>
      Array(GAME_BOARD_SIZE).fill(GAME_CONFIG.TILE_VALUES.TWO)
    );
    const res = placeRandomTile(full);
    expect(res).toBe(full);
  });

  it('should place a 2 when the second random < p(TWO)', () => {
    const board: GameBoard = [
      [2, 2, 2, 2],
      [2, 2, 2, 2],
      [2, 2, 0, 2],
      [2, 2, 2, 2],
    ];
    const res = withMockedRandom([0.42, 0], () => placeRandomTile(board));
    expect(res).not.toBe(board);
    expect(res[2][2]).toBe(GAME_CONFIG.TILE_VALUES.TWO);
  });

  it('should place a 4 when the second random ≥ p(TWO)', () => {
    const board: GameBoard = [
      [0, 2, 2, 2],
      [2, 2, 2, 2],
      [2, 2, 2, 2],
      [2, 2, 2, 2],
    ];
    const res = withMockedRandom([0.5, 0.999], () => placeRandomTile(board));
    expect(res[0][0]).toBe(GAME_CONFIG.TILE_VALUES.FOUR);
  });
});

describe('checkIsWon()', () => {
  it('should return false on an empty board', () => {
    expect(checkIsWon(generateEmptyBoard())).toBe(false);
  });

  it('should return true when WIN_VALUE exists on the board', () => {
    const b = generateEmptyBoard();
    b[1][1] = GAME_CONFIG.WIN_VALUE;
    expect(checkIsWon(b)).toBe(true);
  });
});

describe('checkIsGameOver()', () => {
  it('should return true when no empty cells and no adjacent equals exist', () => {
    const b: GameBoard = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(checkIsGameOver(b)).toBe(true);
  });

  it('should return false when at least one empty cell exists', () => {
    const b: GameBoard = [
      [2, 4, 0, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(checkIsGameOver(b)).toBe(false);
  });

  it('should return false when any horizontal or vertical merge is possible', () => {
    const h: GameBoard = [
      [2, 2, 4, 8],
      [4, 8, 16, 32],
      [2, 4, 8, 16],
      [32, 16, 8, 4],
    ];
    const v: GameBoard = [
      [2, 4, 2, 4],
      [2, 8, 4, 2],
      [8, 16, 8, 16],
      [32, 64, 32, 64],
    ];
    expect(checkIsGameOver(h)).toBe(false);
    expect(checkIsGameOver(v)).toBe(false);
  });
});

describe('move()', () => {
  it('should not mutate the input board (immutability)', () => {
    const start: GameBoard = [
      [2, 0, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const clone = start.map((r) => [...r]);
    void move(start, MOVE_DIRECTION.LEFT);
    expect(start).toEqual(clone);
  });

  it('should compact to the LEFT and merge once per pair', () => {
    const start: GameBoard = [
      [2, 0, 2, 0],
      [2, 2, 2, 0],
      [2, 2, 4, 4],
      [4, 4, 4, 4],
    ];
    const { newBoard, gainedScore, isMoved } = move(start, MOVE_DIRECTION.LEFT);
    expect(newBoard).toEqual([
      [4, 0, 0, 0],
      [4, 2, 0, 0],
      [4, 8, 0, 0],
      [8, 8, 0, 0],
    ]);
    expect(gainedScore).toBe(36);
    expect(isMoved).toBe(true);
  });

  it('should not allow a freshly merged tile to merge again in the same move (LEFT)', () => {
    const start: number[][] = [
      [2, 2, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const r = move(start, MOVE_DIRECTION.LEFT);
    expect(r.newBoard[0]).toEqual([4, 4, 0, 0]);
    expect(r.gainedScore).toBe(4);
  });

  it('should keep isMoved=false and gainedScore=0 when nothing changes (LEFT)', () => {
    const start: GameBoard = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [2, 4, 8, 16],
      [32, 64, 128, 256],
    ];
    const r = move(start, MOVE_DIRECTION.LEFT);
    expect(r.newBoard).toEqual(start);
    expect(r.gainedScore).toBe(0);
    expect(r.isMoved).toBe(false);
  });

  it('should mirror the LEFT behavior when moving RIGHT', () => {
    const start: GameBoard = [
      [2, 0, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { newBoard } = move(start, MOVE_DIRECTION.RIGHT);
    expect(newBoard).toEqual([
      [0, 0, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  it('should merge equal values within a column when moving UP', () => {
    const start: GameBoard = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { newBoard, gainedScore } = move(start, MOVE_DIRECTION.UP);
    expect(newBoard).toEqual([
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(gainedScore).toBe(4);
  });

  it('should perform two independent merges in a single column when moving DOWN', () => {
    const start: GameBoard = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ];
    const { newBoard, gainedScore } = move(start, MOVE_DIRECTION.DOWN);
    expect(newBoard).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [8, 0, 0, 0],
    ]);
    expect(gainedScore).toBe(12);
  });
});
