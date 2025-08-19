import { useCallback, useEffect, useState } from 'react';
import { move, placeRandomTile, checkIsWon, checkIsGameOver, getInitialGameState } from '@/utils/game';
import { GameState, MOVE_DIRECTION } from '@/types/game';
import { KEY_TO_DIRECTION } from '@/utils/game-constants';

export function useGameBoard() {
  const [gameState, setGameState] = useState<GameState>(() => getInitialGameState());

  const reset = useCallback(() => {
    setGameState(getInitialGameState());
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const direction = KEY_TO_DIRECTION[e.key as keyof typeof KEY_TO_DIRECTION];

    if (!direction) {
      return;
    }

    setGameState((prev) => {
      if (prev.isGameOver || prev.isWon) {
        return prev;
      }

      const { newBoard, gainedScore, isMoved } = move(prev.board, direction as MOVE_DIRECTION);

      if (!isMoved) {
        return prev;
      }

      const updatedBoard = placeRandomTile(newBoard);
      const isGameOver = checkIsGameOver(updatedBoard);
      const isWon = checkIsWon(updatedBoard);

      return {
        board: updatedBoard,
        score: prev.score + gainedScore,
        isGameOver,
        isWon,
      };
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return { gameState, reset };
}
