import { createContext, useContext } from 'react';
import { selectUser } from '@/store/authSlice';

type AuthContext = {
  user: ReturnType<typeof selectUser>;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
