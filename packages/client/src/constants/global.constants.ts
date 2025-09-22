export const BASE_API_URL = 'https://ya-praktikum.tech/api/v2';
export const OAUTH_REDIRECT_URI = 'http://localhost:3000';
export const AUTH_REQUIRED_COOKIES = ['authCookie', 'uuid'] as const;
export const AUTH_USER_ENDPOINT = `${BASE_API_URL}/auth/user`;
