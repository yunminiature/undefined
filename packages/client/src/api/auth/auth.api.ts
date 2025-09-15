import { createApi } from '@reduxjs/toolkit/query/react';
import { SignInDTO, SignUpDTO, UserResponse } from '@/api/auth/auth.dto';
import { baseQueryWithAuth } from '@/api/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    signUp: builder.mutation<void, SignUpDTO>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<void, SignInDTO>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getUserInfo: builder.query<UserResponse, void>({
      query: () => ({
        url: '/auth/user',
        method: 'GET',
      }),
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation, useGetUserInfoQuery, useLogoutMutation, useLazyGetUserInfoQuery } =
  authApi;
