import { Button } from '@/components/ui/button';

import shared from '../shared.module.css';
import s from './GameActions.module.css';

interface GameActionsProps {
  gameStatus: 'playing' | 'won' | 'lost';
  onReset: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameActions = ({ gameStatus, onReset, onPlayAgain, onBackToMenu }: GameActionsProps) => {
  const backToMenuButton = (
    <Button onClick={onBackToMenu} variant='outline'>
      ← Back to Menu
    </Button>
  );

  return (
    <div className={`${shared.gameBlock} flex gap-4 justify-center`}>
      {gameStatus === 'playing' ? (
        <Button onClick={onReset}>🔄 Reset Game</Button>
      ) : (
        <Button onClick={onPlayAgain}>🎮 Play Again</Button>
      )}
      {backToMenuButton}
    </div>
  );
};
