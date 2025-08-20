import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

export function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log('[SW] registered, scope: ', reg.scope))
        .catch(err => console.log('[SW] registration failed: ', err))
    });
  }
}

startServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
