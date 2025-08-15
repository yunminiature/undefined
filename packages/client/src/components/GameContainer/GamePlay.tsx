import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';
import { Button } from '../ui/button';

interface GamePlayProps {
  board: number[][];
  onReset: () => void;
}

export const GamePlay = ({ board, onReset }: GamePlayProps) => {
  return (
    <>
      <div className='w-full min-w-[300px] max-w-md sm:max-w-lg lg:w-[32rem] aspect-square'>
        <GameBoardCanvas board={board} />
      </div>
      <div>
        <Button
          onClick={onReset}
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
        >
          Reset game
        </Button>
      </div>
    </>
  );
};
