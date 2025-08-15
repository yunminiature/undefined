import { useGameBoard } from '@/hooks/use-game-board';
import { useState } from 'react';

import { GameWelcome } from './GameWelcome';
import { GamePlay } from './GamePlay';

export const GameContainer = () => {
  const { gameState, reset } = useGameBoard();
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className='flex flex-col gap-6 items-center p-4'>
      {isGameStarted ? (
        <GamePlay board={gameState.board} onReset={reset} />
      ) : (
        <GameWelcome onStartGame={() => setIsGameStarted(true)} />
      )}
    </div>
  );
};
