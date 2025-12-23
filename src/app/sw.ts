/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

interface SWConfig {
  icon: string;
  badge: string;
  defaultUrl: string;
  vibrate: number[];
}

const CFG: SWConfig = {
  icon: '/favicon/android-chrome-192x192.png',
  badge: '/favicon/apple-touch-icon.png',
  defaultUrl: 'https://orbitus.dev',

  vibrate: [100, 50, 100],
};

interface PushPayload<T = Record<string, unknown>> {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  url?: string;
  extra?: T;
}

sw.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;
  let data: PushPayload = { title: 'Notification' };
  try {
    data = event.data.json() as PushPayload;
  } catch {
    data = { title: 'Notification', body: event.data?.text() ?? undefined };
  }

  const options: NotificationOptions & { vibrate?: number[] } = {
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

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | undefined)?.url ?? CFG.defaultUrl;
  event.waitUntil(sw.clients.openWindow(url));
});

// Install event - fired when SW is first installed
sw.addEventListener('install', (event: ExtendableEvent) => {
  // Skip waiting to activate immediately
  event.waitUntil(sw.skipWaiting());
});

// Activate event - fired when SW becomes active
sw.addEventListener('activate', (event: ExtendableEvent) => {
  // Take control of all clients immediately
  event.waitUntil(sw.clients.claim());
});

// Fetch event - intercept network requests (optional, for caching strategies)
sw.addEventListener('fetch', (event: FetchEvent) => {
  // Pass through - no caching by default
  event.respondWith(fetch(event.request));
});

// Message event - handle messages from clients
sw.addEventListener('message', (event: ExtendableMessageEvent) => {
  const data = event.data as { type?: string } | undefined;
  if (data?.type === 'SKIP_WAITING') {
    void sw.skipWaiting();
  }
});

// Notification close event - fired when user dismisses a notification
sw.addEventListener('notificationclose', (event: NotificationEvent) => {
  // Optional: track notification dismissals via analytics
  const tag = event.notification.tag;
  if (tag) {
    // Track dismissal
  }
});

// Background sync event - fired when connectivity is restored
sw.addEventListener('sync', ((event: Event) => {
  const syncEvent = event as ExtendableEvent & { tag?: string };
  if (syncEvent.tag === 'sync-messages') {
    syncEvent.waitUntil(
      // Perform background sync tasks
      Promise.resolve()
    );
  }
}) as EventListener);

// Push subscription change event - handle subscription updates
sw.addEventListener('pushsubscriptionchange', (event: PushSubscriptionChangeEvent) => {
  event.waitUntil(
    // Re-subscribe user to push notifications
    sw.registration.pushManager
      .subscribe(event.oldSubscription?.options ?? { userVisibleOnly: true })
      .then((subscription) => {
        // Send new subscription to server
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      })
  );
});

export {};
