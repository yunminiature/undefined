import type { NextFunction, Request, Response } from 'express';
import { AUTH_REQUIRED_COOKIES, AUTH_USER_ENDPOINT } from '@/constants/global.constants';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const hasAllCookies = AUTH_REQUIRED_COOKIES.every((cookieName) => cookieHeader.includes(`${cookieName}=`));

  if (!hasAllCookies) {
    return res.status(401).json({ error: 'Unauthorized' });
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

      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await response.json();

    res.locals.user = user;

    return next();
  } catch (error) {
    console.error('[AuthMiddleware] Unexpected error during auth check', error);
    return res.status(500).json({ error: 'Failed to verify authorization' });
  }
};
