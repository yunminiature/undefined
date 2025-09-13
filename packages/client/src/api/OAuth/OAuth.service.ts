import { BASE_API_URL, OAUTH_REDIRECT_URI } from '@/constants';
import { baseApi } from '../baseApi';
import { GetServiceIdRequest, GetServiceIdResponse, YandexOAuthRequest, YandexOAuthResponse } from './OAuth.dto';

const OAUTH_ENDPOINTS = {
  getServiceId: BASE_API_URL + '/oauth/yandex/service-id',
  yandexOAuth: BASE_API_URL + '/oauth/yandex',
} as const;

export const yandexOAuthService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceId: builder.query<GetServiceIdResponse, GetServiceIdRequest>({
      query: () => ({
        url: OAUTH_ENDPOINTS.getServiceId,
        method: 'GET',
        params: { redirect_url: OAUTH_REDIRECT_URI },
        credentials: 'include',
      }),
    }),
    yandexOAuth: builder.mutation<YandexOAuthResponse, YandexOAuthRequest>({
      query: (body) => ({
        url: OAUTH_ENDPOINTS.yandexOAuth,
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetServiceIdQuery, useYandexOAuthMutation } = yandexOAuthService;
