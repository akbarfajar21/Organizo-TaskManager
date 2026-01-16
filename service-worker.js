self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Notifikasi Baru";
  const options = {
    body: data.body || "Anda menerima notifikasi.",
    icon: "logo.png",
    badge: "logo.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
