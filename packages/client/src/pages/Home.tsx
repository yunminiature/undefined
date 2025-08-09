import { useGetGreetingQuery } from '@/api/server';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
  return <div>Home page</div>;
}
