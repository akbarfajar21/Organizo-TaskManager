// src/sw.js
import { precacheAndRoute } from "workbox-precaching";

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

const SUPABASE_URL = "https://mhrbaeettymxghjvteqs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocmJhZWV0dHlteGdoanZ0ZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDk3MjAsImV4cCI6MjA4MjU4NTcyMH0.KM3RizXgb6jVkzs0qncwzJzEVBQDiUoKxZepdR-ULu4"; // ✅ UPDATED!
const NOTIFICATION_CHECK_INTERVAL = 60000; // 1 menit

// Store untuk melacak notifikasi yang sudah ditampilkan
let shownNotifications = new Set();
let lastCheckTime = Date.now();

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());

  // Mulai cek notifikasi secara periodik
  startPeriodicNotificationCheck();
});

// Fungsi untuk cek notifikasi baru dari Supabase
async function checkNewNotifications() {
  try {
    // Ambil user_id dari IndexedDB atau cache
    const userId = await getUserId();

    if (!userId) {
      console.log("No user ID found, skipping notification check");
      return;
    }

    // Hitung waktu sejak pengecekan terakhir
    const timeThreshold = new Date(lastCheckTime).toISOString();

    // Fetch notifikasi baru dari Supabase
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/notifications?user_id=eq.${userId}&created_at=gt.${timeThreshold}&is_read=eq.false&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY, // ✅ UPDATED!
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`, // ✅ UPDATED!
        },
      },
    );

    if (response.ok) {
      const notifications = await response.json();

      console.log(`Found ${notifications.length} new notifications`); // ✅ Added logging

      // Tampilkan notifikasi yang belum pernah ditampilkan
      for (const notif of notifications) {
        if (!shownNotifications.has(notif.id)) {
          await self.registration.showNotification(notif.title, {
            body: notif.message,
            icon: "/logo.png",
            badge: "/logo.png",
            tag: `notif-${notif.id}`,
            data: {
              url: "/app/notifications",
              notifId: notif.id,
            },
            vibrate: [200, 100, 200],
            requireInteraction: false,
            silent: false,
          });

          shownNotifications.add(notif.id);
          console.log("Notification shown:", notif.title); // ✅ Added logging
        }
      }

      lastCheckTime = Date.now();
    } else {
      console.error(
        "Failed to fetch notifications:",
        response.status,
        response.statusText,
      );
    }
  } catch (error) {
    console.error("Error checking notifications:", error);
  }
}

// Fungsi untuk mendapatkan user ID
async function getUserId() {
  try {
    // Coba ambil dari localStorage dulu (paling cepat)
    const cachedUserId = await getCachedUserId();
    if (cachedUserId) {
      console.log("Got user ID from cache:", cachedUserId); // ✅ Added logging
      return cachedUserId;
    }

    // Coba ambil dari semua clients yang terbuka
    const allClients = await clients.matchAll({ includeUncontrolled: true });

    for (const client of allClients) {
      // Kirim message ke client untuk mendapatkan user ID
      const response = await new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        client.postMessage({ type: "GET_USER_ID" }, [channel.port2]);

        // Timeout after 1 second
        setTimeout(() => resolve(null), 1000);
      });

      if (response && response.userId) {
        console.log("Got user ID from client:", response.userId); // ✅ Added logging
        return response.userId;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

// Helper untuk ambil user ID dari cache
async function getCachedUserId() {
  try {
    const cache = await caches.open("user-data");
    const cachedResponse = await cache.match("/user-id");
    if (cachedResponse) {
      const data = await cachedResponse.json();
      return data.userId;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Start periodic check
function startPeriodicNotificationCheck() {
  console.log("Starting periodic notification check (every 60 seconds)"); // ✅ Added logging

  // Check immediately after 5 seconds (beri waktu untuk setup)
  setTimeout(() => {
    checkNewNotifications();
  }, 5000);

  // Then check every interval
  setInterval(() => {
    checkNewNotifications();
  }, NOTIFICATION_CHECK_INTERVAL);
}

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked"); // ✅ Added logging
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/app/notifications";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let client of clientList) {
          if (client.url.includes("/app") && "focus" in client) {
            client.navigate(urlToOpen);
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
  console.log("Push received:", event);

  let data = {
    title: "Organizo",
    body: "You have a new notification",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error("Error parsing push data:", e);
      data.body = event.data.text();
    }
  }

  const title = data.title || "Organizo Notification";
  const options = {
    body: data.message || data.body || "You have a new notification",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: data.tag || `notif-${Date.now()}`,
    data: {
      url: data.url || "/app/notifications",
      timestamp: Date.now(),
    },
    requireInteraction: false,
    silent: false,
  };

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => console.log("Notification shown"))
      .catch((err) => console.error("Error showing notification:", err)),
  );
});

// Listen untuk message dari client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GET_USER_ID") {
    // Respond via the port
    if (event.ports[0]) {
      // Client akan handle response
    }
  }

  if (event.data && event.data.type === "SET_USER_ID") {
    console.log("Received user ID from client:", event.data.userId); // ✅ Added logging
    // Cache user ID
    caches.open("user-data").then((cache) => {
      cache.put(
        "/user-id",
        new Response(JSON.stringify({ userId: event.data.userId })),
      );
    });
  }

  if (event.data && event.data.type === "CHECK_NOTIFICATIONS") {
    console.log("Manual notification check requested"); // ✅ Added logging
    checkNewNotifications();
  }
});

// Handle push subscription change
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Push subscription changed");
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        console.log("Resubscribed:", subscription);
        return fetch("/api/update-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });
      }),
  );
});
