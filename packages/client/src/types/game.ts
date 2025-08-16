import { GAME_CONFIG } from '@/utils/game-constants';

export type GameBoard = number[][];

export enum MOVE_DIRECTION {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type GameState = {
  board: GameBoard;
  score: number;
  isGameOver: boolean;
  isWon: boolean;
};

export type WinValue = typeof GAME_CONFIG.WIN_VALUE;
