import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className='flex flex-col items-center w-full'>
      <Outlet />
      <footer className='border-t px-6 py-4 text-center text-sm text-muted-foreground w-full'>
        © 2025 undefined team
      </footer>
    </div>
  );
};
