import { RefreshCcw, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import shared from '../shared.module.css';
import { GameStatus } from '../types';

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
  );
};
