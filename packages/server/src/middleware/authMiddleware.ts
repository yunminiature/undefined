import type { NextFunction, Request, Response } from 'express';
// NOTE: We import from client constants via webpack alias '@'.
// Add defensive logs to see the resolved endpoint at runtime.
import { AUTH_REQUIRED_COOKIES, AUTH_USER_ENDPOINT } from '@/constants/global.constants';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!AUTH_USER_ENDPOINT) {
      console.error('[AuthMiddleware] AUTH_USER_ENDPOINT is not defined');
    }
  } catch (e) {
    console.error('[AuthMiddleware] Failed to access constants', e);
  }
  if (req.method === 'OPTIONS') {
    return next();
  }

  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Проверяем наличие хотя бы одной из требуемых кук (более гибкий подход)
  const hasAnyCookie = AUTH_REQUIRED_COOKIES.some((cookieName) => cookieHeader.includes(`${cookieName}=`));

  if (!hasAnyCookie) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const response = await fetch(AUTH_USER_ENDPOINT, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      if (response.status >= 500) {
        console.error(`[AuthMiddleware] Auth service failed with status ${response.status}`);
        return res.status(502).json({ error: 'Auth service unavailable' });
      }

      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await response.json();

    res.locals.user = user;

    return next();
  } catch (error) {
    console.error('[AuthMiddleware] Unexpected error during auth check', error);
    return res.status(500).json({ error: 'Failed to verify authorization' });
  }
};
