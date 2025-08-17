import { ReactNode } from 'react';

interface RulePointProps {
  number: number;
  children: ReactNode;
}

export const RulePoint = ({ number, children }: RulePointProps) => {
  return (
    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors'>
      <span className='text-primary font-bold text-sm'>{number}</span>
      <p className='text-sm text-muted-foreground'>{children}</p>
    </div>
  );
};
