// public/sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/app/notifications";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Cek apakah sudah ada window yang terbuka
        for (let client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        // Jika tidak ada, buka window baru
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

// Handle push notification
self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Organizo Notification";
  const options = {
    body: data.message || data.body || "You have a new notification",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: data.tag || "notification",
    data: {
      url: data.url || "/app/notifications",
    },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
