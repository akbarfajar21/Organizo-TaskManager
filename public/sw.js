self.addEventListener("push", function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/logo.png",
    data: {
      url: data.url, // simpan url agar bisa dipakai saat klik notifikasi
    },
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Jika sudah ada tab terbuka dengan url yang sama, fokuskan tab itu
      for (let client of windowClients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      // Jika belum ada, buka tab baru dengan url tersebut
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
