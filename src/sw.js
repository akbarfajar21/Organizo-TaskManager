// src/sw.js
import { precacheAndRoute } from "workbox-precaching";

// Precache semua assets yang di-generate oleh Vite
precacheAndRoute(self.__WB_MANIFEST);

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
        for (let client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
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
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Organizo", message: event.data.text() };
    }
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
