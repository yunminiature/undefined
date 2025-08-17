import { PartyPopper, Frown } from 'lucide-react';

import s from './GameHeader.module.css';
import shared from '../shared.module.css';
import { GameStatus } from '../types';

type GameHeaderProps = {
  gameStatus: Exclude<GameStatus, 'not-started'>;
};

const getGameEndConfig = (isWon: boolean) => ({
  icon: isWon ? <PartyPopper className='w-6 h-6' /> : <Frown className='w-6 h-6' />,
  title: isWon ? 'Congratulations!' : 'Game Over',
  message: isWon ? 'You reached 2048! Amazing job!' : 'No more moves possible. Better luck next time!',
  colorClass: isWon ? 'text-green-600' : 'text-red-600',
});

export const GameHeader = ({ gameStatus }: GameHeaderProps) => {
  const isWon = gameStatus === 'won';

  if (gameStatus === 'playing') {
    return (
      <div className={`${s.gameHeader} flex items-center justify-center`}>
        <div className='text-muted-foreground/30 text-sm'>Keep playing to reach 2048!</div>
      </div>
    );
  }

  const config = getGameEndConfig(isWon);

  return (
    <div className={`${shared.gameBlock} ${s.gameHeader}`}>
      <div className={`flex items-center justify-center gap-2 ${config.colorClass}`}>
        {config.icon}
        <h2 className={`text-3xl font-bold`}>{config.title}</h2>
      </div>
      <p className='text-lg text-muted-foreground'>{config.message}</p>
    </div>
  );
};
