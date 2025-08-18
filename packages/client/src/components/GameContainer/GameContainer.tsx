import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas';
import { useGameBoard } from '@/hooks/use-game-board';
import { Button } from '@/components/ui/button';
import { FullscreenButton } from './FullscreenButton';

export const GameContainer = () => {
  const { state, reset } = useGameBoard();

  return (
    <div className='flex flex-col gap-6 items-center p-4'>
      <div className='w-full min-w-[300px] max-w-md sm:max-w-lg lg:w-[32rem] aspect-square'>
        <GameBoardCanvas board={state.board} />
      </div>
      <div className='flex gap-3'>
        <Button
          onClick={reset}
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
        >
          Reset
        </Button>
        <FullscreenButton variant='outline' />
      </div>
    </div>
  );
};
