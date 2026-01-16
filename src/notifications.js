const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://beckend-notification-organizo.vercel.app";

// Fungsi untuk menunggu service worker benar-benar ready
const waitForServiceWorker = async (timeout = 10000) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.active) {
      console.log("✅ Service Worker is active and ready");
      return registration;
    }
    console.log("⏳ Waiting for Service Worker to activate...");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Service Worker did not activate in time");
};

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

  if (!("PushManager" in window)) {
    console.error("❌ Browser tidak mendukung Push Notifications");
    alert("Browser Anda tidak mendukung Push Notifications");
    return false;
  }

  try {
    // Tunggu service worker ready dulu
    console.log("⏳ Menunggu Service Worker siap...");
    await waitForServiceWorker();

    const permission = await Notification.requestPermission();
    console.log("📋 Notification permission:", permission);

    if (permission === "granted") {
      console.log("✅ Notification permission granted");

      // Tambahkan delay sebelum subscribe
      await new Promise((resolve) => setTimeout(resolve, 500));

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
    alert(`Error: ${error.message}`);
    return false;
  }
};

// Fungsi untuk subscribe ke push notifications
export const subscribeUserToPushNotifications = async () => {
  try {
    console.log("🔄 Starting push notification subscription...");

    // Pastikan service worker ready
    const registration = await navigator.serviceWorker.ready;
    console.log("✅ Service Worker ready:", registration);

    // Unsubscribe dari subscription lama jika ada
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log("🔄 Unsubscribing from old subscription...");
      await subscription.unsubscribe();
      subscription = null;
    }

    // Dapatkan VAPID public key
    console.log("🔑 Fetching VAPID public key...");
    const publicKey = await getVapidPublicKey();

    // Delay sebentar untuk memastikan semuanya ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Subscribe ke push manager
    console.log("📱 Subscribing to push manager...");
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });

    console.log("✅ Push subscription created:", subscription);

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
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Error handling yang lebih spesifik
    if (error.name === "NotAllowedError") {
      alert(
        "Notifikasi diblokir. Silakan aktifkan di pengaturan browser Anda."
      );
    } else if (error.name === "NotSupportedError") {
      alert("Browser Anda tidak mendukung push notifications.");
    } else if (error.message.includes("VAPID")) {
      alert("Gagal mendapatkan kunci keamanan. Silakan coba lagi.");
    } else {
      alert(`Gagal mengaktifkan notifikasi: ${error.message}`);
    }

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
    `🔑 Fetching VAPID key from: ${BACKEND_URL}/api/vapid-public-key`
  );

  try {
    const response = await fetch(`${BACKEND_URL}/api/vapid-public-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.publicKey) {
      throw new Error("Public key not found in response");
    }

    console.log("✅ VAPID public key received");

    return urlBase64ToUint8Array(data.publicKey);
  } catch (error) {
    console.error("❌ Error fetching VAPID key:", error);
    throw new Error(`Gagal mendapatkan VAPID key: ${error.message}`);
  }
};

// Fungsi untuk mengonversi base64 ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  try {
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
  } catch (error) {
    console.error("❌ Error converting base64:", error);
    throw new Error("Invalid VAPID public key format");
  }
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

// Fungsi untuk unsubscribe
export const unsubscribeFromPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log("✅ Unsubscribed from push notifications");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Error unsubscribing:", error);
    return false;
  }
};
