import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createAppStore } from './store';
import App from './App';
import './index.css';
import { ThemeProvider } from '@/providers';

// Типизация для предзагруженного состояния
declare global {
  interface Window {
    __PRELOADED_STATE__?: Record<string, unknown>;
  }
}

export function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[SW] registered, scope: ', reg.scope))
        .catch((err) => console.log('[SW] registration failed: ', err));
    });
  }
}

const preloadedState = typeof window !== 'undefined' ? window.__PRELOADED_STATE__ : undefined;
const store = createAppStore(preloadedState);

// Функция для создания приложения с провайдерами
const createApp = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// Функция для инициализации клиентского приложения
const initializeApp = () => {
  const container = document.getElementById('root') as HTMLElement;

  // Проверяем, есть ли предзагруженное состояние (SSR)
  if (preloadedState) {
    // Очищаем предзагруженное состояние
    delete window.__PRELOADED_STATE__;

    // Используем hydrateRoot для гидратации SSR контента
    hydrateRoot(container, createApp());
  } else {
    console.log('🚀 Запуск клиентского приложения...');

    // Обычный рендер для клиентского приложения
    const root = createRoot(container);
    root.render(<React.StrictMode>{createApp()}</React.StrictMode>);
  }
};

// Запускаем Service Worker
startServiceWorker();

// Инициализируем приложение
initializeApp();
