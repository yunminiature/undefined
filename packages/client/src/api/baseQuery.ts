import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { BASE_API_URL } from '@/constants';
import { clearUser } from '@/store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { endpoint }) => {
    // Для авторизационных запросов принудительно отключаем кэш
    if (endpoint && endpoint.includes('auth')) {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
    }
    return headers;
  },
});

// Специальный baseQuery для локального API
// Используем относительный путь для работы через Vite proxy (dev) и nginx proxy (prod)
export const localApiBaseQuery = fetchBaseQuery({
  baseUrl: '/api', // Относительный путь - проксируется на сервер
  credentials: 'include', // Автоматически передает куки
});

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  const err = result.error;
  if (err && 'status' in err) {
    const { status } = err;

    if (typeof status === 'number') {
      if (status === 401) {
        api.dispatch(clearUser());
        toast.error('Your session has expired. Please sign in again.');
      } else if (status === 403) {
        toast.error('Access denied.');
      } else if (status >= 500) {
        toast.error('Server error.');
      }
    } else {
      switch (status) {
        case 'FETCH_ERROR':
          toast.error('Network error or server unreachable.');
          break;
        case 'PARSING_ERROR':
          toast.error('Response parsing error.');
          break;
        case 'CUSTOM_ERROR':
          toast.error('Request failed with a custom error.');
          break;
      }
    }
  }

  return result;
};
