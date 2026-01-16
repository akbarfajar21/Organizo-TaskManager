// public/sw-custom.js
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);
  
  let data;
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("Error parsing push data:", e);
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
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked");
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || "/";
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});