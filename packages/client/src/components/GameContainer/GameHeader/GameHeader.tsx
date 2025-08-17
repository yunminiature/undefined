import { PartyPopper, Frown, Trophy } from 'lucide-react';

import s from './GameHeader.module.css';
import shared from '../shared.module.css';
import { GameStatus } from '../types';

type GameHeaderProps = {
  gameStatus: Exclude<GameStatus, 'not-started'>;
  score: number;
};

const getGameEndConfig = (isWon: boolean) => {
  if (isWon) {
    return {
      icon: <PartyPopper className='w-6 h-6' />,
      title: 'Congratulations!',
      message: 'You reached 2048! Amazing job!',
      colorClass: 'text-green-600',
    };
  }

  return {
    icon: <Frown className='w-6 h-6' />,
    title: 'Game Over',
    message: 'No more moves possible. Better luck next time!',
    colorClass: 'text-red-600',
  };
};

export const GameHeader = ({ gameStatus, score }: GameHeaderProps) => {
  const isWon = gameStatus === 'won';

  if (gameStatus === 'playing') {
    return (
      <div className={`${s.gameHeader} flex items-center justify-between`}>
        <div className='text-muted-foreground/60 text-lg'>Keep playing to reach 2048!</div>
        <div className='text-primary text-lg font-medium'>Score: {score.toLocaleString()}</div>
      </div>
    );
  }

  const config = getGameEndConfig(isWon);

  return (
    <div className={`${shared.gameBlock} ${s.gameHeader}`}>
      <div className={`flex items-center justify-between ${config.colorClass}`}>
        <div className='flex items-center gap-2'>
          {config.icon}
          <h2 className='text-3xl font-bold'>{config.title}</h2>
        </div>
        <div className='flex items-center gap-2 text-primary'>
          <Trophy className='w-5 h-5' />
          <span className='text-xl font-semibold'>Your score: {score.toLocaleString()}</span>
        </div>
      </div>
      <p className='text-lg text-muted-foreground mt-2'>{config.message}</p>
    </div>
  );
};
