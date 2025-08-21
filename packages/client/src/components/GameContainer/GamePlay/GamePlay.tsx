import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';
import { TileMovement } from '@/utils/game';

import shared from '../shared.module.css';

interface GamePlayProps {
  board: number[][];
  movements: TileMovement[];
}

export const GamePlay = ({ board, movements }: GamePlayProps) => {
  return (
    <div className={`${shared.gameBlock} min-w-[300px] aspect-square`}>
      <GameBoardCanvas board={board} movements={movements} />
    </div>
  );
};
