import express from 'express';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import ServerApp from './components/ServerApp';
import { createAppStore } from '../../client/src/store';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 3000;

const clientDistPath = path.join(__dirname, '../../client/dist');

// Serve static files from client build
app.use('/static', express.static(clientDistPath));
app.use('/assets', express.static(path.join(clientDistPath, 'assets')));
// Serve root-level assets like /preview.png, but do not serve index.html
app.use(express.static(clientDistPath, { index: false }));

const apiRouter = express.Router();

apiRouter.use(authMiddleware);

// Health check endpoint (requires auth)
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes placeholder
apiRouter.use((_req, res) => {
  // Здесь можно добавить API роуты
  res.status(404).json({ error: 'API endpoint not found' });
});

app.use('/api', apiRouter);

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

// SSR middleware
const renderReactApp = (req: express.Request, res: express.Response) => {
  try {
    console.log(`🔍 SSR рендер для маршрута: ${req.url}`);

    // Создаем стор на сервере и при необходимости диспатчим prefetch экшены
    const store = createAppStore();

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

    // Fallback HTML в случае ошибки
    const fallbackHtml = createHTMLTemplate(
      '<div style="text-align: center; padding: 50px;"><h1>Загрузка приложения...</h1><p>Пожалуйста, подождите</p></div>',
      {}
    );

    res.status(500).send(fallbackHtml);
  }
};

// SSR для всех остальных маршрутов
app.get('*', renderReactApp);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error('Server Error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`🚀 SSR Server запущен на порту ${port}`);
  console.log(`📂 Статические файлы обслуживаются из: ${clientDistPath}`);
});

export default app;
