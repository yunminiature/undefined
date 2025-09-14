import { toast } from 'sonner';
import { useState, useMemo, useEffect } from 'react';

import { useGameBoard } from '@/hooks/use-game-board';
import { useAudio } from '@/audio';

import { GameWelcome } from './GameWelcome';
import { GamePlay } from './GamePlay';
import { GameHeader } from './GameHeader';
import { GameActions } from './GameActions';
import { GameStatus } from './types';
import { useGameAudio } from '@/hooks/useGameAudio';

export const GameContainer = () => {
  const { gameState, reset, animationData, clearAnimationData } = useGameBoard();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { playSound } = useAudio();

  useGameAudio(animationData);

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

  useEffect(() => {
    if (gameState.isWon) {
      playSound('win');
    } else if (gameState.isGameOver) {
      playSound('lose');
    }
  }, [gameState.isWon, gameState.isGameOver, playSound]);

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
          <GameHeader gameStatus={gameStatus} score={gameState.score} />
          <GamePlay board={gameState.board} animationData={animationData} onAnimationComplete={clearAnimationData} />
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
