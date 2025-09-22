import React, { ReactNode, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  authRoute?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/sign-in', authRoute }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const shouldRedirect = useMemo(() => (authRoute ? isAuthenticated : !isAuthenticated), [authRoute, isAuthenticated]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    if (authRoute) {
      const from = (location.state as { from?: { pathname?: string } } | null)?.from;
      const target = from?.pathname ?? redirectTo;
      return <Navigate to={target} replace />;
    }

    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
