import { RefreshCcw, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import shared from '../shared.module.css';
import { GameStatus } from '../types';
import { FullscreenButton } from '../FullscreenButton';

interface GameActionsProps {
  gameStatus: GameStatus;
  onReset: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameActions = ({ gameStatus, onReset, onPlayAgain, onBackToMenu }: GameActionsProps) => {
  const backToMenuButton = (
    <Button onClick={onBackToMenu} variant='outline'>
      <ArrowLeft /> Back to Menu
    </Button>
  );

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div className={`${shared.gameBlock} flex gap-4 justify-center`}>
        {gameStatus === 'playing' ? (
          <Button onClick={onReset}>
            <RefreshCcw /> Reset Game
          </Button>
        ) : (
          <Button onClick={onPlayAgain}>
            <RotateCcw /> Play Again
          </Button>
        )}
        {backToMenuButton}
      </div>
      <FullscreenButton variant='outline' size='sm' />
    </div>
  );
};
