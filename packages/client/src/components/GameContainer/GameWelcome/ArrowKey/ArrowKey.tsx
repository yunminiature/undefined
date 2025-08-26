interface ArrowKeyProps {
  children: React.ReactNode;
}

export const ArrowKey = ({ children }: ArrowKeyProps) => {
  return <kbd className='px-2 py-1 text-xs font-mono bg-background border rounded'>{children}</kbd>;
};
