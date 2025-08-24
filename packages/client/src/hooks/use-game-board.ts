import { useCallback, useEffect, useState } from 'react';
import { move, placeRandomTile, checkIsWon, checkIsGameOver, getInitialGameState, TileMovement } from '@/utils/game';
import { GameState, MOVE_DIRECTION } from '@/types/game';
import { KEY_TO_DIRECTION } from '@/utils/game-constants';

type AnimationData = {
  board: number[][];
  movements: TileMovement[];
  newTile?: { x: number; y: number; value: number };
};

export function useGameBoard() {
  const [gameState, setGameState] = useState<GameState>(() => getInitialGameState());
  const [animationData, setAnimationData] = useState<AnimationData | null>(null);

  const reset = useCallback(() => {
    setGameState(getInitialGameState());
    setAnimationData(null);
  }, []);

  const clearAnimationData = useCallback(() => {
    setAnimationData(null);
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const direction = KEY_TO_DIRECTION[e.key as keyof typeof KEY_TO_DIRECTION];

    if (!direction) {
      return;
    }

    e.preventDefault();

    setGameState((prev) => {
      if (prev.isGameOver || prev.isWon) {
        return prev;
      }

      const { newBoard, gainedScore, isMoved, movements } = move(prev.board, direction as MOVE_DIRECTION);

      if (!isMoved) {
        return prev;
      }

      const { board: updatedBoard, newTile: placedTile } = placeRandomTile(newBoard);

      setAnimationData({
        board: updatedBoard,
        movements,
        newTile: placedTile,
      });

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

  return { gameState, reset, animationData, clearAnimationData };
}
