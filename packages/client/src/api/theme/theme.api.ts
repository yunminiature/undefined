import { baseApi } from '@/api/baseApi';
import type { SetThemeRequest, ThemeResponse } from './theme.dto';

export const themeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTheme: builder.query<ThemeResponse, void>({
      query: () => ({ url: '/api/theme', method: 'GET' }),
      providesTags: ['Theme'],
    }),
    setTheme: builder.mutation<ThemeResponse, SetThemeRequest>({
      query: (body) => ({ url: '/api/theme', method: 'POST', body }),
      invalidatesTags: ['Theme'],
    }),
  }),
});

export const { useGetThemeQuery, useLazyGetThemeQuery, useSetThemeMutation } = themeApi;
