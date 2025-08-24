import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';
import { TileMovement } from '@/utils/game';

import shared from '../shared.module.css';

type AnimationData = {
  board: number[][];
  movements: TileMovement[];
  newTile?: { x: number; y: number; value: number };
};

interface GamePlayProps {
  board: number[][];
  animationData: AnimationData | null;
  onAnimationComplete?: () => void;
}

export const GamePlay = ({ board, animationData, onAnimationComplete }: GamePlayProps) => {
  return (
    <div className={`${shared.gameBlock} min-w-[300px] aspect-square`}>
      <GameBoardCanvas
        board={board}
        movements={animationData?.movements || []}
        newTile={animationData?.newTile}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
};
