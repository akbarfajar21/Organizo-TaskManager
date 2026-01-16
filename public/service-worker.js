import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

// Precache semua assets yang di-generate oleh Vite
precacheAndRoute(self.__WB_MANIFEST);

// Cache untuk API Supabase
registerRoute(
  ({ url }) => url.hostname.includes("supabase.co"),
  new NetworkFirst({
    cacheName: "supabase-api-cache",
  })
);

// Cache untuk gambar dan assets
registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "images-cache",
  })
);

console.log("🚀 Service Worker loaded!");

self.addEventListener("install", (event) => {
  console.log("📦 Service Worker: Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker: Activating...");
  event.waitUntil(
    clients.claim().then(() => {
      console.log("🎯 Service Worker: Now controlling all pages");
    })
  );
});

// ========== PUSH NOTIFICATION HANDLER ==========
self.addEventListener("push", (event) => {
  console.log("🔔 Push notification received:", event);

  let data;
  try {
    data = event.data ? event.data.json() : {};
    console.log("📨 Push data:", data);
  } catch (e) {
    console.error("❌ Error parsing push data:", e);
    data = { title: "Notifikasi Baru", body: "Anda menerima notifikasi." };
  }

  const title = data.title || "Notifikasi Baru";
  const options = {
    body: data.body || "Anda menerima notifikasi.",
    icon: "/logo.png",
    badge: "/logo.png",
    data: { url: data.link || "/" },
    vibrate: [200, 100, 200],
    tag: "task-notification",
    requireInteraction: false,
    actions: [
      {
        action: "open",
        title: "Buka",
      },
      {
        action: "close",
        title: "Tutup",
      },
    ],
  };

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => {
        console.log("✅ Notification shown successfully!");
      })
      .catch((err) => {
        console.error("❌ Error showing notification:", err);
      })
  );
});

// ========== NOTIFICATION CLICK HANDLER ==========
self.addEventListener("notificationclick", (event) => {
  console.log("👆 Notification clicked:", event);
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        console.log("🔍 Found clients:", clientList.length);

        // Cari window yang sudah terbuka
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            console.log("🎯 Focusing existing window");
            return client.focus();
          }
        }

        // Jika tidak ada, buka window baru
        if (clients.openWindow) {
          console.log("🪟 Opening new window:", urlToOpen);
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((err) => {
        console.error("❌ Error handling notification click:", err);
      })
  );
});

// ========== MESSAGE HANDLER (Optional) ==========
self.addEventListener("message", (event) => {
  console.log("💬 Message received in SW:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
