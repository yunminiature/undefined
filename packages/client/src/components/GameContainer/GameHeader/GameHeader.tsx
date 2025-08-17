import s from './GameHeader.module.css';
import shared from '../shared.module.css';

interface GameHeaderProps {
  gameStatus: 'playing' | 'won' | 'lost';
  isWon?: boolean;
}

export const GameHeader = ({ gameStatus, isWon }: GameHeaderProps) => {
  if (gameStatus === 'playing') {
    return (
      <div className={`${s.gameHeader} flex items-center justify-center`}>
        <div className='text-muted-foreground/30 text-sm'>Keep playing to reach 2048!</div>
      </div>
    );
  }

  return (
    <div className={`${shared.gameBlock} ${s.gameHeader}`}>
      <h2 className={`text-3xl font-bold ${isWon ? 'text-green-600' : 'text-red-600'}`}>
        {isWon ? '🎉 Congratulations!' : '😔 Game Over'}
      </h2>
      <p className='text-lg text-muted-foreground'>
        {isWon ? 'You reached 2048! Amazing job!' : 'No more moves possible. Better luck next time!'}
      </p>
    </div>
  );
};
