export const BASE_API_URL = 'http://localhost:3001/api/v2'; // Сервер на порту 3001
export const OAUTH_REDIRECT_URI = 'http://localhost:3000'; // Клиент на порту 3000
export const AUTH_REQUIRED_COOKIES = ['uuid', 'authCookie'] as const; // Возвращаем к оригинальным кукам
export const AUTH_USER_ENDPOINT = `${BASE_API_URL}/auth/user`;
