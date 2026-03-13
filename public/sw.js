// Empty service worker to satisfy browser requests from orphaned registrations.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() => {
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
});
