import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ServerApp from './components/ServerApp';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from client build
app.use('/static', express.static(path.join(__dirname, '../../client/dist')));
app.use('/assets', express.static(path.join(__dirname, '../../client/dist/assets')));

// HTML template function
const createHTMLTemplate = (reactHtml: string, preloadedState: Record<string, unknown> = {}) => `
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React SSR Application</title>
    <link rel="stylesheet" href="/static/index.css">
    <link rel="stylesheet" href="/assets/index.css">
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
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')};
    </script>
    <script src="/static/index.js"></script>
    <script src="/assets/index.js"></script>
  </body>
</html>
`;

// SSR middleware
const renderReactApp = (req: express.Request, res: express.Response) => {
  try {
    console.log(`🔍 SSR рендер для маршрута: ${req.url}`);

    // Рендерим серверное приложение
    const reactApp = <ServerApp url={req.url} />;

    const appString = ReactDOMServer.renderToString(reactApp);

    // Базовое состояние для клиентского приложения
    const preloadedState = {
      auth: { isAuthenticated: false, user: null },
      forum: { topics: [], currentTopic: null },
    };

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes placeholder
app.use('/api', (_req, res) => {
  // Здесь можно добавить API роуты
  res.status(404).json({ error: 'API endpoint not found' });
});

// SSR для всех остальных маршрутов
app.get('*', renderReactApp);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error('Server Error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`🚀 SSR Server запущен на порту ${port}`);
  console.log(`📂 Статические файлы обслуживаются из: ${path.join(__dirname, '../../client/dist')}`);
});

export default app;
