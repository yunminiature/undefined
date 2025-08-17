import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';

import shared from '../shared.module.css';

interface GamePlayProps {
  board: number[][];
}

export const GamePlay = ({ board }: GamePlayProps) => {
  return (
    <div className={`${shared.gameBlock} min-w-[300px] aspect-square`}>
      <GameBoardCanvas board={board} />
    </div>
  );
};
