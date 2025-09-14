import { useEffect } from 'react';
import { TileMovement } from '@/utils/game';
import { useAudio } from '@/audio';

type AnimationData = {
  board: number[][];
  movements: TileMovement[];
  newTile?: { x: number; y: number; value: number };
};

export function useGameAudio(animationData: AnimationData | null) {
  const { playSound } = useAudio();

  useEffect(() => {
    if (!animationData) {
      return;
    }

    console.log('useGameAudio', animationData);

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
}
