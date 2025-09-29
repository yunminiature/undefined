import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Theme } from '../models/Theme';
import { ThemePreference } from '../models/ThemePreference';
import { AUTH_USER_ENDPOINT, AUTH_REQUIRED_COOKIES } from '@/constants/global.constants';

interface AuthUser {
  id?: number | string;
}

const router = Router();

function parseCookies(cookieHeader?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach((c) => {
    const [k, ...rest] = c.trim().split('=');
    const v = rest.join('=');
    if (k) out[k] = decodeURIComponent(v || '');
  });
  return out;
}

async function resolveUserId(cookieHeader?: string): Promise<string | null> {
  try {
    if (!cookieHeader) return null;
    const hasAllCookies = AUTH_REQUIRED_COOKIES.every((c) => cookieHeader.includes(`${c}=`));
    if (!hasAllCookies) return null;
    if (!AUTH_USER_ENDPOINT) return null;
    const response = await fetch(AUTH_USER_ENDPOINT, {
      method: 'GET',
      headers: { cookie: cookieHeader },
    });
    if (!response.ok) return null;
    const user = (await response.json()) as AuthUser;
    const idVal = user.id;
    if (idVal === undefined || idVal === null || idVal === '') return null;
    return String(idVal);
  } catch {
    return null;
  }
}

async function ensureDefaultThemes() {
  const existing = await Theme.count();
  if (existing > 0) return;
  await Theme.bulkCreate([
    {
      name: 'light',
      //задел на будущее
      palette: {
        '--bg-color': '#ffffff',
        '--text-color': '#1c1c1c',
        '--muted-text': '#666666',
        '--primary-color': '#3b82f6',
        '--card-bg': '#f7f7f8',
        '--border-color': '#e5e7eb',
      },
    },
    {
      name: 'dark',
      //задел на будущее
      palette: {
        '--bg-color': '#0f172a',
        '--text-color': '#e5e7eb',
        '--muted-text': '#94a3b8',
        '--primary-color': '#60a5fa',
        '--card-bg': '#111827',
        '--border-color': '#1f2937',
      },
    },
  ]);
}

router.get('/themes', async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultThemes();
    const themes = await Theme.findAll({ order: [['name', 'ASC']] });
    res.json(themes);
  } catch (err) {
    console.error('[Theme] GET /themes failed', err);
    res.status(500).json({ error: 'Failed to load themes' });
  }
});

router.get('/theme', async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultThemes();
    const cookies = parseCookies(req.headers.cookie);
    const anonSid = cookies['anon_sid'];
    const userId = await resolveUserId(req.headers.cookie);

    const theme = await (async () => {
      if (userId) {
        const pref = await ThemePreference.findOne({
          where: { userId },
          include: [{ model: Theme, as: 'theme' }],
        });
        if (pref?.theme) return pref.theme;
      }
      if (anonSid) {
        const pref = await ThemePreference.findOne({
          where: { sessionId: anonSid },
          include: [{ model: Theme, as: 'theme' }],
        });
        if (pref?.theme) return pref.theme;
      }
      const light = await Theme.findOne({ where: { name: 'light' } });
      return light;
    })();

    if (!anonSid) {
      const sid = randomUUID();
      res.cookie('anon_sid', sid, { httpOnly: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 365 });
    }

    res.json({ name: theme?.name, palette: theme?.palette });
  } catch (err) {
    console.error('[Theme] GET /theme failed', err);
    res.status(500).json({ error: 'Failed to load theme' });
  }
});

const setThemeSchema = z.object({ name: z.string().min(1).max(64) });

router.post('/theme', async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultThemes();
    const parsed = setThemeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() });
      return;
    }
    const { name } = parsed.data;

    const theme = await Theme.findOne({ where: { name } });
    if (!theme) {
      res.status(404).json({ error: 'Theme not found' });
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    let anonSid = cookies['anon_sid'];
    if (!anonSid) {
      anonSid = randomUUID();
      res.cookie('anon_sid', anonSid, { httpOnly: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 365 });
    }
    const userId = await resolveUserId(req.headers.cookie);

    if (userId) {
      const existing = await ThemePreference.findOne({ where: { userId } });
      if (existing) {
        existing.themeId = theme.id;
        await existing.save();
      } else {
        await ThemePreference.create({ userId, sessionId: null, themeId: theme.id });
      }
    } else {
      const existing = await ThemePreference.findOne({ where: { sessionId: anonSid } });
      if (existing) {
        existing.themeId = theme.id;
        await existing.save();
      } else {
        await ThemePreference.create({ userId: null, sessionId: anonSid, themeId: theme.id });
      }
    }

    res.json({ name: theme.name, palette: theme.palette });
  } catch (err) {
    console.error('[Theme] POST /theme failed', err);
    res.status(500).json({ error: 'Failed to set theme' });
  }
});

export default router;
