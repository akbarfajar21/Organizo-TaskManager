const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://beckend-notification-organizo.vercel.app";

// Meminta izin untuk push notifications
export const requestNotificationPermission = async () => {
  console.log("🔔 Requesting notification permission...");

  if (!("Notification" in window)) {
    console.error("❌ Browser tidak mendukung notifikasi");
    alert("Browser Anda tidak mendukung notifikasi");
    return false;
  }

  if (!("serviceWorker" in navigator)) {
    console.error("❌ Browser tidak mendukung Service Worker");
    alert("Browser Anda tidak mendukung Service Worker");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("📋 Notification permission:", permission);

    if (permission === "granted") {
      console.log("✅ Notification permission granted");
      const subscribed = await subscribeUserToPushNotifications();
      return subscribed;
    } else if (permission === "denied") {
      console.log("❌ Notification permission denied");
      alert("Anda telah menolak notifikasi. Aktifkan di pengaturan browser.");
      return false;
    } else {
      console.log("⚠️ Notification permission dismissed");
      return false;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return false;
  }
};

// Fungsi untuk subscribe ke push notifications
export const subscribeUserToPushNotifications = async () => {
  try {
    console.log("⏳ Waiting for service worker to be ready...");
    const registration = await navigator.serviceWorker.ready;
    console.log("✅ Service Worker ready:", registration);

    // Cek subscription yang ada
    let subscription = await registration.pushManager.getSubscription();
    console.log("📱 Current subscription:", subscription);

    if (!subscription) {
      console.log("🆕 No existing subscription found. Creating new one...");
      const publicKey = await getVapidPublicKey();

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });

      console.log("✅ New subscription created:", subscription);
    } else {
      console.log("♻️ Using existing subscription");
    }

    // Kirim subscription ke server
    console.log(`📤 Sending subscription to: ${BACKEND_URL}/api/subscribe`);

    const response = await fetch(`${BACKEND_URL}/api/subscribe`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Subscription saved to server:", data);

    // Test notifikasi lokal
    await testNotification(registration);

    return true;
  } catch (error) {
    console.error("❌ Error in push subscription:", error);
    alert(`Gagal subscribe push notification: ${error.message}`);
    return false;
  }
};

// Fungsi untuk test notifikasi lokal
const testNotification = async (registration) => {
  try {
    console.log("🧪 Testing local notification...");
    await registration.showNotification("🎉 Notifikasi Aktif!", {
      body: "Push notification berhasil diaktifkan!",
      icon: "/logo.png",
      badge: "/logo.png",
      vibrate: [200, 100, 200],
      tag: "test-notification",
    });
    console.log("✅ Test notification shown");
  } catch (error) {
    console.error("❌ Error showing test notification:", error);
  }
};

// Mendapatkan VAPID public key dari backend
const getVapidPublicKey = async () => {
  console.log(
    `🔑 Fetching VAPID public key from: ${BACKEND_URL}/api/vapid-public-key`
  );

  const response = await fetch(`${BACKEND_URL}/api/vapid-public-key`);

  if (!response.ok) {
    throw new Error(`Failed to fetch VAPID public key: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ VAPID public key fetched successfully");

  return urlBase64ToUint8Array(data.publicKey);
};

// Fungsi untuk mengonversi base64 ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Export fungsi untuk check subscription status
export const checkSubscriptionStatus = async () => {
  try {
    if (!("serviceWorker" in navigator)) return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    console.log("📊 Subscription status:", !!subscription);
    return !!subscription;
  } catch (error) {
    console.error("❌ Error checking subscription:", error);
    return false;
  }
};
