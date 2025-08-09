import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ServerRequest, ServerResponse } from './server.dto';

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:${__SERVER_PORT__ ?? 3001}`,
  }),
  endpoints: (builder) => ({
    getGreeting: builder.query<ServerResponse, ServerRequest>({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetGreetingQuery, useLazyGetGreetingQuery } = serverApi;
