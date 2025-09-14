import { RefreshCcw, RotateCcw, ArrowLeft, Volume, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import shared from '../shared.module.css';
import { GameStatus } from '../types';
import { FullscreenButton } from '../FullscreenButton';

interface GameActionsProps {
  gameStatus: GameStatus;
  isAudioEnabled: boolean;
  onReset: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onToggleAudio: () => void;
}

export const GameActions = ({
  gameStatus,
  isAudioEnabled,
  onReset,
  onPlayAgain,
  onBackToMenu,
  onToggleAudio,
}: GameActionsProps) => {
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
      <div className={`${shared.gameBlock} flex gap-4 justify-center`}>
        <FullscreenButton variant='outline' size='sm' />
        <Button size='sm' onClick={onToggleAudio}>
          {isAudioEnabled ? <Volume2 /> : <Volume />} Audio
        </Button>
      </div>
    </div>
  );
};
