export type GetServiceIdRequest = void;
export type GetServiceIdResponse = {
  service_id: string;
};

export type YandexOAuthRequest = {
  code: string;
  redirect_uri: string;
};
export type YandexOAuthResponse = void;
