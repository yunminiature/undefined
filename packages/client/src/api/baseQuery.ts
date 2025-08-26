import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { BASE_API_URL } from '@/constants';
import { clearUser } from '@/store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  credentials: 'include',
});

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && 'status' in result.error) {
    if (result.error.status === 401) {
      api.dispatch(clearUser());
      toast.error('The session has expired. Please log in again.');
    } else if (result.error.status === 403) {
      toast.error('Access is denied');
    } else if (result.error.status >= 500) {
      toast.error('Server error');
    }
  }

  return result;
};
