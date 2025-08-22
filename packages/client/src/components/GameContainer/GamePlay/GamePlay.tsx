import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';
import { TileMovement } from '@/utils/game';

import shared from '../shared.module.css';

interface GamePlayProps {
  board: number[][];
  movements: TileMovement[];
  onAnimationComplete?: () => void;
}

export const GamePlay = ({ board, movements, onAnimationComplete }: GamePlayProps) => {
  return (
    <div className={`${shared.gameBlock} min-w-[300px] aspect-square`}>
      <GameBoardCanvas board={board} movements={movements} onAnimationComplete={onAnimationComplete} />
    </div>
  );
};
