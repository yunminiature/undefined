import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { FC, PropsWithChildren } from 'react';

export const BoundaryByRoute: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
};
