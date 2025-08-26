const VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${VERSION}`;
const API_CACHE = `api-${VERSION}`;
const APP_SHELL = ['/', '/index.html'];

async function getViteAssets() {
  try {
    const res = await fetch('/manifest.json', { cache: 'no-cache' });
    const manifest = await res.json();
    const files = new Set(APP_SHELL);

    for (const key in manifest) {
      const entry = manifest[key];
      [entry.file, ...(entry.css || []), ...(entry.assets || [])]
        .filter(Boolean)
        .forEach((p) => files.add(p.startsWith('/') ? p : `/${p}`));
    }
    return [...files];
  } catch (e) {
    console.error('[SW] manifest.json not found', e);
    return APP_SHELL;
  }
}

// --- install ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const urls = await getViteAssets();
      const cache = await caches.open(STATIC_CACHE);

      await Promise.allSettled(
        urls.map(async (u) => {
          try {
            const resp = await fetch(u, { cache: 'reload' });
            if (resp && (resp.ok || resp.type === 'opaque')) {
              await cache.put(u, resp.clone());
              console.log('[SW] cached', u);
            }
          } catch (err) {
            console.warn('[SW] skip', u, err);
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

// --- activate ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = [STATIC_CACHE, API_CACHE];
      const names = await caches.keys();
      await Promise.all(names.map((n) => (keep.includes(n) ? null : caches.delete(n))));
      await self.clients.claim();
      console.log('[SW] activated');
    })()
  );
});

// --- fetch ---
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!/^https?:\/\//.test(request.url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cached = await caches.match('/index.html', { ignoreSearch: true });
        try {
          return await fetch(request);
        } catch {
          return cached || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
        }
      })()
    );
    return;
  }

  if (request.url.includes('/api')) {
    if (request.method !== 'GET' || request.url.includes('/auth')) {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE);
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.ok) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            cache.put(request, fresh.clone()).catch(() => {});
          }
          return fresh;
        } catch {
          const cached = await cache.match(request, { ignoreSearch: true });
          return (
            cached ||
            new Response(JSON.stringify({ offline: true }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200,
            })
          );
        }
      })()
    );
    return;
  }

  const url = new URL(request.url);
  const isAsset = /\.(?:css|js|wasm|png|jpe?g|gif|webp|svg|mp3|ogg|wav|ico|ttf|woff2?)(\?.*)?$/i.test(url.pathname);
  if (request.method === 'GET' && isAsset && url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request, { ignoreSearch: true });
        const fetchPromise = fetch(request)
          .then((resp) => {
            if (resp && (resp.ok || resp.type === 'opaque')) {
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              cache.put(request, resp.clone()).catch(() => {});
            }
            return resp;
          })
          .catch(() => undefined);
        return cached || (await fetchPromise) || new Response('', { status: 504 });
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      try {
        return await fetch(request);
      } catch {
        const cached = await caches.match(request, { ignoreSearch: true });
        return cached || new Response('', { status: 504 });
      }
    })()
  );
});
