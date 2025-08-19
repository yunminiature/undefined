import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useGetGreetingQuery } from '@/api/server';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

export default function Home() {
  const { data, isSuccess, error } = useGetGreetingQuery();

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error('Error fetching data from the server');
    }
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to 2048</h1>
      <p className='max-w-2xl text-gray-600 mb-8'>
        In a faraway digital realm, mysterious numbered tiles await. Your quest is to merge them, doubling their values,
        and reach the mythical 2048 tile. Every move counts — plan wisely and don’t let the board fill up!
      </p>
      <img src='/preview.png' alt='2048 game preview' className='w-full max-w-xs rounded-md shadow-lg mb-8' />
      <Button asChild>
        <Link to='/game'>
          <Gamepad2 className='w-4 h-4' />
          Play Game
        </Link>
      </Button>
    </div>
  );
}
