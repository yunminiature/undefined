import React, { useEffect, FC, PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserInfoQuery, useLogoutMutation } from '@/api/auth';
import { setUser, clearUser, selectIsAuthenticated, selectUser } from '@/store/authSlice';
import { toast } from 'sonner';
import { AuthContext } from './AuthContext';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data: userInfo, isLoading, refetch, isSuccess } = useGetUserInfoQuery();

  const [logoutQuery] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess && userInfo) {
      dispatch(setUser(userInfo));
    }
  }, [isSuccess, userInfo, dispatch]);

  const logout = async () => {
    try {
      logoutQuery();
      dispatch(clearUser());
    } catch (error) {
      toast.error('Logout failed. Please try again later.');
    }
  };

  const refreshUserInfo = async () => {
    try {
      const result = await refetch();
      if (result.data) {
        dispatch(setUser(result.data));
      }
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout,
        refreshUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
