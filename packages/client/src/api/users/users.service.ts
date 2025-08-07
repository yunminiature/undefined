import { BASE_API_URL } from '@/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChangePasswordRequest, ChangePasswordResponse } from './users.dto';

export const usersService = createApi({
  reducerPath: 'usersService',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: '/user/password',
        method: 'PUT',
        body,
      }),
    }),
    changeAvatar: builder.mutation<{ avatar: string }, FormData>({
      query: (formData) => ({
        url: '/user/profile/avatar', // swagger: PUT /user/profile/avatar
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

export const { useChangePasswordMutation, useChangeAvatarMutation } = usersService;
