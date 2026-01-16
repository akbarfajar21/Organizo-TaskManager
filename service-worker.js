// Event listener untuk menangani push event
self.addEventListener("push", function (event) {
  const data = event.data.json(); // Ambil data yang dikirim dari server
  const title = data.title || "Tugas Anda";
  const options = {
    body: data.body || "Ada tugas baru untuk dikerjakan!",
    icon: "logo.png",
    badge: "logo.png",
    data: {
      link: data.link || "/app/tasks", // Pastikan data.link dikirim dari server
    },
  };

  // Menampilkan notifikasi
  event.waitUntil(self.registration.showNotification(title, options));
});

// Event listener untuk menangani interaksi dengan notifikasi
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.link) // Arahkan pengguna ke halaman tertentu
  );
});
