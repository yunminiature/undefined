import { createApi } from '@reduxjs/toolkit/query/react';
import { ChangePasswordRequest, ChangePasswordResponse } from './users.dto';
import { baseQueryWithAuth } from '@/api/baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithAuth,
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

export const { useChangePasswordMutation, useChangeAvatarMutation } = usersApi;
