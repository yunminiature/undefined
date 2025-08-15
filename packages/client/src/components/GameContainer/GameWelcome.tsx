import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RulePoint } from './RulePoint';
import { ArrowKey } from './ArrowKey';

interface GameWelcomeProps {
  onStartGame: () => void;
}

export const GameWelcome = ({ onStartGame }: GameWelcomeProps) => {
  const rules = [
    {
      number: 1,
      content: (
        <>
          Use <ArrowKey>↑</ArrowKey> <ArrowKey>↓</ArrowKey> <ArrowKey>←</ArrowKey> <ArrowKey>→</ArrowKey> arrow keys to
          move tiles
        </>
      ),
    },
    {
      number: 2,
      content: 'When two tiles with the same number touch, they merge into one with the sum of their values',
    },
    {
      number: 3,
      content: (
        <>
          You win when you create a tile with the number <span className='font-bold text-primary'>2048</span>
        </>
      ),
    },
    {
      number: 4,
      content: 'Game ends when the board is full and no more moves are possible',
    },
  ] as const;

  return (
    <Card className='shadow-lg'>
      <CardHeader className='text-center'>
        <div className='space-y-2'>
          <CardTitle className='text-4xl font-bold text-foreground'>So you want to play 2048?</CardTitle>
          <CardDescription className='text-lg'>
            Get ready to challenge your mind with this addictive puzzle game!
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-foreground flex items-center gap-2'>
            <span className='w-2 h-2 bg-primary rounded-full'></span>
            How to Play
          </h3>

          <ul className='flex flex-col gap-2 list-none p-0 m-0'>
            {rules.map((rule) => (
              <li key={rule.number} className='list-none'>
                <RulePoint number={rule.number}>{rule.content}</RulePoint>
              </li>
            ))}
          </ul>
        </div>

        <div className='pt-4 border-t border-border/50'>
          <div className='text-center space-y-4'>
            <p className='text-sm text-muted-foreground'>Ready to start your 2048 journey?</p>
            <Button
              onClick={onStartGame}
              className='px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              🎮 Start Game
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
