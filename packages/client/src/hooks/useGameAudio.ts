import { useEffect } from 'react';
import { TileMovement } from '@/utils/game';
import { useAudio } from '@/audio';
import { GameState } from '@/types/game';

type AnimationData = {
  board: number[][];
  movements: TileMovement[];
  newTile?: { x: number; y: number; value: number };
};

export function useGameAudio(gameState: GameState, animationData: AnimationData | null) {
  const { playSound, config, toggleEnabled } = useAudio();

  useEffect(() => {
    if (!animationData || !config.enabled) {
      return;
    }

    const { movements, newTile } = animationData;

    if (movements.length > 0) {
      const hasMerges = movements.some((movement) => movement.merged);

      if (hasMerges) {
        const mergedMovements = movements.filter((movement) => movement.merged);

        if (mergedMovements.length > 1) {
          playSound('combo');
        }

        mergedMovements.forEach((movement) => {
          if (movement.mergedValue) {
            if (movement.mergedValue >= 256) {
              playSound('milestone');
            } else {
              playSound('merge', { value: movement.mergedValue });
            }
          }
        });
      } else {
        playSound('move');
      }
    }

    if (newTile) {
      playSound('newTile');
    }
  }, [animationData, playSound]);

  useEffect(() => {
    if (!gameState || !config.enabled) {
      return;
    }

    if (gameState.isWon) {
      playSound('win');
    } else if (gameState.isGameOver) {
      playSound('lose');
    }
  }, [gameState.isWon, gameState.isGameOver, playSound, config.enabled]);

  return {
    playSound,
    config,
    toggleEnabled,
  };
}
