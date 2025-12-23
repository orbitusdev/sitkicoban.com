// src/app/sw.ts
var sw = self;
var CFG = {
  icon: '/favicon/android-chrome-192x192.png',
  badge: '/favicon/apple-touch-icon.png',
  defaultUrl: 'https://orbitus.dev',
  vibrate: [100, 50, 100],
};
sw.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = { title: 'Notification' };
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Notification', body: event.data?.text() ?? void 0 };
  }
  const options = {
    body: data.body,
    icon: data.icon ?? CFG.icon,
    badge: data.badge ?? CFG.badge,
    vibrate: CFG.vibrate,
    data: {
      url: data.url ?? CFG.defaultUrl,
      dateOfArrival: Date.now(),
      primaryKey: '2',
      extra: data.extra,
    },
  };
  event.waitUntil(sw.registration.showNotification(data.title, options));
});
sw.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? CFG.defaultUrl;
  event.waitUntil(sw.clients.openWindow(url));
});
sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting());
});
sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim());
});
sw.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
sw.addEventListener('message', (event) => {
  const data = event.data;
  if (data?.type === 'SKIP_WAITING') {
    void sw.skipWaiting();
  }
});
sw.addEventListener('notificationclose', (event) => {
  const tag = event.notification.tag;
  if (tag) {
  }
});
sw.addEventListener('sync', (event) => {
  const syncEvent = event;
  if (syncEvent.tag === 'sync-messages') {
    syncEvent.waitUntil(
      // Perform background sync tasks
      Promise.resolve()
    );
  }
});
sw.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    // Re-subscribe user to push notifications
    sw.registration.pushManager
      .subscribe(event.oldSubscription?.options ?? { userVisibleOnly: true })
      .then((subscription) => {
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      })
  );
});
