import { useLazyGetUserInfoQuery } from '@/api/auth';
import { useYandexOAuthMutation } from '@/api/OAuth';
import { OAUTH_REDIRECT_URI } from '@/constants';
import { setUser } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const cleanQuery = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.toString());
};

export const useOAuth = (isAuthenticated: boolean) => {
  const [yandexOAuth, { isLoading: isExchanging }] = useYandexOAuthMutation();
  const [getUserInfo] = useLazyGetUserInfoQuery();
  const dispatch = useAppDispatch();

  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const code = params.get('code');
  const state = params.get('state');
  const onceRef = useRef(false);

  useEffect(() => {
    if (code && isAuthenticated) {
      cleanQuery();
      return;
    }

    if (!code || isAuthenticated || onceRef.current) return;

    const expected = sessionStorage.getItem('ya_oauth_state');

    if (!state || !expected || state !== expected) {
      toast.error('OAuth state mismatch');
      cleanQuery();
      return;
    }

    onceRef.current = true;

    (async () => {
      try {
        await yandexOAuth({ code, redirect_uri: OAUTH_REDIRECT_URI });

        sessionStorage.removeItem('ya_oauth_state');
        const user = await getUserInfo().unwrap();

        dispatch(setUser(user));

        cleanQuery();
      } catch (error) {
        console.error(error);
        toast.error('OAuth error');
      }
    })();
  }, [code, state, isAuthenticated, yandexOAuth, getUserInfo, dispatch]);

  return { code, isExchanging };
};
