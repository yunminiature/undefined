// Автоматически подставляем текущий origin, чтобы работать и на localhost, и на домене
const ORIGIN =
  typeof window !== 'undefined'
    ? window.location.origin
    : `http://localhost:${(globalThis as unknown as { __SERVER_PORT__?: number }).__SERVER_PORT__ ?? 3001}`;

export const BASE_API_URL = `${ORIGIN}/api/v2`;
export const OAUTH_REDIRECT_URI = ORIGIN; // редирект всегда на текущий origin
export const AUTH_REQUIRED_COOKIES = ['uuid', 'authCookie'] as const; // Возвращаем к оригинальным кукам
export const AUTH_USER_ENDPOINT = `${BASE_API_URL}/auth/user`;
