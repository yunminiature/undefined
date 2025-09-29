import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
    credentials: 'include',
  }),
  tagTypes: ['Theme'],
  endpoints: () => ({}),
});
