import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request } from 'express';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import ServerApp from './components/ServerApp';
import { createAppStore } from '../../client/src/store';
import { authMiddleware } from './middleware/authMiddleware';
import { ensureDatabaseConnection, syncDatabase } from './db/sequelize';
import topicsRouter from './web/topicsRouter';
import commentsRouter from './web/commentsRouter';
import reactionsRouter from './web/reactionsRouter';

const app = express();
const port = process.env.SERVER_PORT || 3001; // Сервер на 3001, Vite на 3000

// Define path to client files depending on environment
const clientDistPath =
  process.env.NODE_ENV === 'production'
    ? path.join('/client/dist') // In Docker container
    : path.join(__dirname, '../../client/dist'); // Locally

// Serve static files from client build
app.use('/static', express.static(clientDistPath));
app.use('/assets', express.static(path.join(clientDistPath, 'assets')));
// Serve root-level assets like /preview.png, but do not serve index.html
app.use(express.static(clientDistPath, { index: false }));

// CORS настройки - более гибкие для разных браузеров
app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем запросы без origin (например, мобильные приложения)
      if (!origin) return callback(null, true);

      // Разрешаем localhost с любым портом для разработки
      if (origin.match(/^http:\/\/localhost(:\d+)?$/)) {
        return callback(null, true);
      }

      // В продакшене можно добавить конкретные домены
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    // Добавляем дополнительные заголовки для совместимости с разными браузерами
    optionsSuccessStatus: 200, // Для старых браузеров
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'X-Requested-With',
      'Cache-Control',
      'Pragma',
      'Expires',
    ],
  })
);

// Парсинг cookies
app.use(cookieParser());

// Проксирование на внешний API Яндекс.Практикума
const proxyOptions: unknown = {
  target: 'https://ya-praktikum.tech/api/v2', // Включаем /api/v2 в target
  changeOrigin: true,
  secure: true, // Проверяем SSL сертификаты
  pathRewrite: {
    '^/api/v2': '',
  },
  cookieDomainRewrite: {
    'ya-praktikum.tech': 'localhost',
    '.ya-praktikum.tech': 'localhost',
  },
  cookiePathRewrite: {
    '*': '/',
  },
  onProxyReq: (proxyReq: unknown, req: Request) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} -> https://ya-praktikum.tech/api/v2${req.url}`);
    console.log(`[PROXY] User-Agent:`, req.headers['user-agent']);
    console.log(`[PROXY] Origin:`, req.headers['origin']);
    console.log(`[PROXY] Referer:`, req.headers['referer']);
    console.log(`[PROXY] Request cookies:`, req.headers.cookie);
    console.log(`[PROXY] Content-Type:`, req.headers['content-type']);
    console.log(`[PROXY] Content-Length:`, req.headers['content-length']);

    // Принудительно устанавливаем заголовки для лучшей совместимости
    if (proxyReq && typeof proxyReq === 'object' && 'setHeader' in proxyReq) {
      (proxyReq as { setHeader: (name: string, value: string) => void }).setHeader(
        'User-Agent',
        req.headers['user-agent'] || 'Mozilla/5.0 (compatible; LocalProxy/1.0)'
      );

      // Обеспечиваем передачу всех необходимых заголовков
      if (req.headers['accept']) {
        (proxyReq as { setHeader: (name: string, value: string) => void }).setHeader('Accept', req.headers['accept']);
      }
      if (req.headers['accept-language']) {
        (proxyReq as { setHeader: (name: string, value: string) => void }).setHeader(
          'Accept-Language',
          req.headers['accept-language']
        );
      }
      if (req.headers['content-type']) {
        (proxyReq as { setHeader: (name: string, value: string) => void }).setHeader(
          'Content-Type',
          req.headers['content-type']
        );
      }
    }

    // Для POST запросов убеждаемся что тело передается
    if (req.method === 'POST' && req.body) {
      console.log(`[PROXY] POST body:`, req.body);
    }
  },
  onProxyRes: (proxyRes: unknown, req: Request) => {
    if (proxyRes && typeof proxyRes === 'object' && 'statusCode' in proxyRes && 'headers' in proxyRes) {
      const response = proxyRes as { statusCode: number; headers: Record<string, unknown> };
      console.log(`[PROXY] Response status:`, response.statusCode);
      console.log(`[PROXY] Response cookies:`, response.headers['set-cookie']);
      console.log(`[PROXY] User-Agent:`, req.headers['user-agent']);

      // КРИТИЧНО: Запрещаем кэширование авторизационных запросов
      if (req.url.includes('/auth/')) {
        response.headers['cache-control'] = 'no-cache, no-store, must-revalidate';
        response.headers['pragma'] = 'no-cache';
        response.headers['expires'] = '0';
        console.log(`[PROXY] Added no-cache headers for auth request: ${req.url}`);
      }

      // Принудительно устанавливаем все куки для localhost с учетом особенностей браузеров
      if (response.headers['set-cookie']) {
        const userAgent = req.headers['user-agent'] || '';
        const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
        const isFirefox = userAgent.includes('Firefox');

        console.log(`[PROXY] Browser detected: ${isChrome ? 'Chrome' : isFirefox ? 'Firefox' : 'Other'}`);

        const setCookieHeaders = response.headers['set-cookie'] as string[];
        response.headers['set-cookie'] = setCookieHeaders.map((cookie: string) => {
          let modified = cookie
            .replace(/Domain=ya-praktikum\.tech/gi, 'Domain=localhost')
            .replace(/Domain=\.ya-praktikum\.tech/gi, 'Domain=localhost')
            .replace(/Secure;?/gi, '') // Убираем Secure для localhost
            .replace(/SameSite=None/gi, 'SameSite=Lax'); // Меняем SameSite

          // Дополнительные настройки для Chrome
          if (isChrome) {
            // Chrome более строгий к HttpOnly и SameSite
            if (!modified.includes('HttpOnly') && !modified.includes('csrftoken')) {
              modified += '; HttpOnly';
            }
            // Убеждаемся что Path установлен
            if (!modified.includes('Path=')) {
              modified += '; Path=/';
            }
          }

          console.log(`[PROXY] Cookie transformation (${isChrome ? 'Chrome' : isFirefox ? 'Firefox' : 'Other'}):`);
          console.log(`  Original: ${cookie}`);
          console.log(`  Modified: ${modified}`);

          return modified;
        });
        console.log(`[PROXY] Final cookies being sent to browser:`, response.headers['set-cookie']);
      } else {
        console.log(`[PROXY] No cookies in response for ${req.url}`);
      }
    }
  },
  onError: (err: unknown, req: Request) => {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.log(`[PROXY ERROR] ${req.originalUrl}:`, errorMessage);
  },
  logger: console,
};

app.use('/api/v2', createProxyMiddleware(proxyOptions));

// Парсинг JSON
app.use(express.json({ limit: '1mb' }));

// Middleware для логирования всех запросов
app.use((req, _res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  console.log(`[REQUEST] Headers:`, Object.keys(req.headers));
  console.log(`[REQUEST] User-Agent:`, req.headers['user-agent']);
  console.log(`[REQUEST] Content-Type:`, req.headers['content-type']);
  if (req.method === 'POST') {
    console.log(`[REQUEST] POST Body:`, req.body);
  }
  next();
});

// Локальные API роуты (для форума) - требуют аутентификацию
const localApiRouter = express.Router();
localApiRouter.use(authMiddleware);

// Health check endpoint (requires auth)
localApiRouter.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Локальные API маршруты для форума
localApiRouter.use('/topics', topicsRouter);
localApiRouter.use('/comments', commentsRouter);
localApiRouter.use('/reactions', reactionsRouter);
localApiRouter.use((_req, res) => res.status(404).json({ error: 'Local API endpoint not found' }));

app.use('/api', localApiRouter);

// Resolve built asset filenames from Vite manifest
const manifestPath = path.join(clientDistPath, 'manifest.json');
let clientJs = '/assets/index.js';
let clientCss: string | null = null;
try {
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestRaw);
  if (manifest['index.html']?.file) clientJs = `/${manifest['index.html'].file}`;
  const css = manifest['index.html']?.css?.[0];
  if (css) clientCss = `/${css}`;
} catch (e) {
  console.warn('⚠️  Could not read Vite manifest. Falling back to default asset names.', e);
}

// HTML template function
const createHTMLTemplate = (reactHtml: string, preloadedState: Record<string, unknown> = {}) => `
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React SSR Application</title>
    ${clientCss ? `<link rel="stylesheet" href="${clientCss}">` : ''}
    <style>
      /* Критические стили для предотвращения FOUC */
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      #root {
        min-height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="root">${reactHtml}</div>
    <script>
      // Передача состояния Redux на клиент
      window.__PRELOADED_STATE__ = ${serialize(preloadedState, { isJSON: true })};
    </script>
    <script src="${clientJs}" type="module"></script>
  </body>
</html>
`;

// SSR middleware с Redux Provider
const renderReactApp = (req: express.Request, res: express.Response) => {
  try {
    console.log(`🔍 SSR рендер для маршрута: ${req.url}`);

    // Создаем стор на сервере в SSR режиме (без RTK Query middleware)
    const store = createAppStore(undefined, true);

    // Рендерим серверное приложение с маршрутизатором и провайдером стора
    const reactApp = (
      <Provider store={store}>
        <ServerApp url={req.url} />
      </Provider>
    );

    const appString = ReactDOMServer.renderToString(reactApp);
    const preloadedState = store.getState() as unknown as Record<string, unknown>;

    const html = createHTMLTemplate(appString, preloadedState);

    res.status(200).send(html);
  } catch (error) {
    console.error('❌ SSR Error:', error);

    // В случае ошибки SSR - fallback на CSR
    console.log('🔄 Falling back to client-side rendering');
    const fallbackHtml = createHTMLTemplate(
      '<div id="root"><div style="text-align: center; padding: 50px;"><h1>Загрузка приложения...</h1><p>Пожалуйста, подождите</p></div></div>',
      {}
    );

    res.status(200).send(fallbackHtml);
  }
};

// SSR для всех остальных маршрутов
app.get('*', renderReactApp);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error('Server Error:', err);
  res.status(500).send('Internal Server Error');
});

async function start() {
  try {
    await ensureDatabaseConnection();
    await syncDatabase();
  } catch (e) {
    console.error('❌ Failed to connect to Postgres via Sequelize', e);
  }

  app.listen(port, () => {
    console.log(`🚀 SSR Server запущен на порту ${port}`);
    console.log(`📂 Статические файлы обслуживаются из: ${clientDistPath}`);
    console.log(`[ENV] NODE_ENV=${process.env.NODE_ENV} SERVER_PORT=${process.env.SERVER_PORT}`);
  });
}

start();

export default app;
