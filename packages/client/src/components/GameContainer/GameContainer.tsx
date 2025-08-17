import { toast } from 'sonner';
import { useState, useMemo } from 'react';

import { useGameBoard } from '@/hooks/use-game-board';

import { GameWelcome } from './GameWelcome';
import { GamePlay } from './GamePlay';
import { GameHeader } from './GameHeader';
import { GameActions } from './GameActions';
import { GameStatus } from './types';

export const GameContainer = () => {
  const { gameState, reset } = useGameBoard();
  const [isGameStarted, setIsGameStarted] = useState(false);

  const gameStatus = useMemo((): GameStatus => {
    if (!isGameStarted) {
      return 'not-started';
    }
    if (gameState.isWon) {
      return 'won';
    }
    if (gameState.isGameOver) {
      return 'lost';
    }
    return 'playing';
  }, [isGameStarted, gameState.isWon, gameState.isGameOver]);

  const handlePlayAgain = () => {
    try {
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to reset game');
    }
  };

  const handleBackToMenu = () => {
    try {
      setIsGameStarted(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col gap-6 items-center justify-center'>
      {gameStatus === 'not-started' && <GameWelcome onStartGame={() => setIsGameStarted(true)} />}

      {(gameStatus === 'playing' || gameStatus === 'won' || gameStatus === 'lost') && (
        <>
          <GameHeader gameStatus={gameStatus} />
          <GamePlay board={gameState.board} />
          <GameActions
            gameStatus={gameStatus}
            onReset={reset}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
          />
        </>
      )}
    </div>
  );
};
