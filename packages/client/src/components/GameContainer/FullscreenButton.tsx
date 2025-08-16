import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface FullscreenButtonProps {
  element?: HTMLElement;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const FullscreenButton = ({
  element,
  variant = 'outline',
  size = 'default',
  className = '',
}: FullscreenButtonProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleToggle = async () => {
    await toggleFullscreen(element);
  };

  return (
    <Button onClick={handleToggle} variant={variant} size={size} className={className}>
      {isFullscreen ? (
        <>
          <Minimize2 className='h-4 w-4 mr-2' />
          Exit Fullscreen
        </>
      ) : (
        <>
          <Maximize2 className='h-4 w-4 mr-2' />
          Fullscreen
        </>
      )}
    </Button>
  );
};
