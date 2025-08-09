import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className='flex flex-col items-center w-full'>
      <Outlet />
    </div>
  );
};
