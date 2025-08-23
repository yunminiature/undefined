import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';
import { TileMovement } from '@/utils/game';

import shared from '../shared.module.css';

type GameUpdate = {
  board: number[][];
  movements: TileMovement[];
  newTile?: { x: number; y: number; value: number };
};

interface GamePlayProps {
  board: number[][];
  gameUpdate: GameUpdate | null;
  onAnimationComplete?: () => void;
}

export const GamePlay = ({ board, gameUpdate, onAnimationComplete }: GamePlayProps) => {
  return (
    <div className={`${shared.gameBlock} min-w-[300px] aspect-square`}>
      <GameBoardCanvas
        board={board}
        movements={gameUpdate?.movements || []}
        newTile={gameUpdate?.newTile}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
};
