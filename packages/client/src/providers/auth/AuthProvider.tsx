import { useEffect, FC, PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserInfoQuery, useLogoutMutation } from '@/api/auth';
import { setUser, clearUser, selectIsAuthenticated, selectUser } from '@/store/authSlice';
import { toast } from 'sonner';
import { AuthContext } from '@/providers';
import { useOAuth } from '@/hooks/useOAuth';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { code, isExchanging } = useOAuth(isAuthenticated);

  const {
    data: userInfo,
    isLoading: isUserLoading,
    refetch,
    isSuccess,
  } = useGetUserInfoQuery(undefined, {
    skip: !!code || isExchanging,
  });

  const [logoutQuery] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess && userInfo) {
      dispatch(setUser(userInfo));
    }
  }, [isSuccess, userInfo, dispatch]);

  const logout = async () => {
    try {
      await logoutQuery();
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
        isLoading: isUserLoading || isExchanging,
        logout,
        refreshUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
