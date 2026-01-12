self.addEventListener("push", function (event) {
  // Pastikan ada data dan parsing dengan aman
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error("Push event data is not valid JSON:", e);
      data = { title: "Notifikasi", body: "Ada notifikasi baru." };
    }
  } else {
    data = { title: "Notifikasi", body: "Ada notifikasi baru." };
  }

  const title = data.title || "Notifikasi";
  const options = {
    body: data.body || "",
    icon: data.icon || data.avatar_url || "/logo.png",
    badge: data.badge || "/badge-icon.png", // opsional, icon kecil di status bar
    data: { url: data.url || "/" },
    vibrate: data.vibrate || [100, 50, 100], // opsional, pola getar
    tag: data.tag || "general-notification", // opsional, untuk mengelompokkan notifikasi
    renotify: data.renotify || false, // opsional, notifikasi ulang jika tag sama
  };

  // Pastikan event.waitUntil dipakai agar service worker tidak dihentikan sebelum showNotification selesai
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let client of windowClients) {
          // Fokus tab yang sudah terbuka dengan url yang sama
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        // Jika tidak ada, buka tab baru
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
