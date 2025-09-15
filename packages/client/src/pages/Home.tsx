import { useAuth } from '@/providers';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    if (isAuthenticated) {
      navigate('/game');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to 2048</h1>
      <p className='max-w-2xl text-gray-600 mb-8'>
        In a faraway digital realm, mysterious numbered tiles await. Your quest is to merge them, doubling their values,
        and reach the mythical 2048 tile. Every move counts — plan wisely and don’t let the board fill up!
      </p>
      <img src='/preview.png' alt='2048 game preview' className='w-full max-w-xs rounded-md shadow-lg mb-8' />
      <Button onClick={handleStartPlaying}>
        <Gamepad2 className='w-4 h-4 mr-2' />
        {isAuthenticated ? 'Start Playing' : 'Sign In to Play'}
      </Button>
    </div>
  );
}
