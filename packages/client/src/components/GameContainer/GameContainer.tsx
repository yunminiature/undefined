import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useGameBoard } from '@/hooks/use-game-board';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useSubmitScoreMutation } from '@/api/leaderboard';
import { selectUser } from '@/store/authSlice';
import type { LeaderboardAddRequest } from '@/api/leaderboard';

import { GameWelcome } from './GameWelcome';
import { GamePlay } from './GamePlay';
import { GameHeader } from './GameHeader';
import { GameActions } from './GameActions';
import { GameStatus } from './types';

export const GameContainer = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { gameState, reset, animationData, clearAnimationData } = useGameBoard(isGameStarted);
  const { config, toggleEnabled } = useGameAudio(gameState, animationData);

  const [submitScore] = useSubmitScoreMutation();
  const user = useSelector(selectUser);

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
    const ended = gameStatus === 'won' || gameStatus === 'lost';
    if (!ended) return;

    const preferredName = (
      user?.display_name ||
      user?.login ||
      `${user?.first_name ?? ''} ${user?.second_name ?? ''}`
    ).trim();
    const undefinedName = preferredName.length > 0 ? preferredName : 'Anonymous';

    const payload: LeaderboardAddRequest = {
      data: { undefinedName, undefinedScore: gameState.score },
    };

    submitScore(payload)
      .unwrap()
      .then(() => toast.success('Score submitted to leaderboard'));
  }, [gameStatus]);

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
            isAudioEnabled={config.enabled}
            onReset={reset}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
            onToggleAudio={toggleEnabled}
          />
        </>
      )}
    </div>
  );
};
