import { useGameBoard } from '@/hooks/use-game-board';
import { useState, useMemo } from 'react';

import { GameWelcome } from './GameWelcome';
import { GamePlay } from './GamePlay';
import { GameHeader } from './GameHeader';
import { GameActions } from './GameActions';

const GAME_STATUSES = {
  NOT_STARTED: 'not-started',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
} as const;

type GameStatus = typeof GAME_STATUSES[keyof typeof GAME_STATUSES];

export const GameContainer = () => {
  const { gameState, reset } = useGameBoard();
  const [isGameStarted, setIsGameStarted] = useState(false);

  const gameStatus = useMemo((): GameStatus => {
    if (!isGameStarted) {
      return GAME_STATUSES.NOT_STARTED;
    }
    if (gameState.isWon) {
      return GAME_STATUSES.WON;
    }
    if (gameState.isGameOver) {
      return GAME_STATUSES.LOST;
    }
    return GAME_STATUSES.PLAYING;
  }, [isGameStarted, gameState.isWon, gameState.isGameOver]);

  const handlePlayAgain = () => {
    reset();
  };

  const handleBackToMenu = () => {
    setIsGameStarted(false);
    reset();
  };

  return (
    <div className='flex flex-col gap-6 items-center justify-center'>
      {gameStatus === GAME_STATUSES.NOT_STARTED && <GameWelcome onStartGame={() => setIsGameStarted(true)} />}

      {(gameStatus === GAME_STATUSES.PLAYING ||
        gameStatus === GAME_STATUSES.WON ||
        gameStatus === GAME_STATUSES.LOST) && (
        <>
          <GameHeader gameStatus={gameStatus} isWon={gameStatus === GAME_STATUSES.WON} />

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
