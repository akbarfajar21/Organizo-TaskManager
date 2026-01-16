export const requestNotificationPermission = async () => {
  if ("Notification" in window && navigator.serviceWorker) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");
      await subscribeUserToPushNotifications();
    } else {
      console.log("Notification permission denied");
    }
  }
};

export const subscribeUserToPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    // ✅ Cek apakah sudah subscribe
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const publicKey = await getVapidPublicKey();
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });
    }

    console.log("User subscription:", subscription);

    // ✅ Kirim subscription ke server
    const response = await fetch("http://localhost:5000/api/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Cek response sebelum parse
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Subscription saved:", data);
  } catch (error) {
    console.error("Error in push subscription:", error);
  }
};

const getVapidPublicKey = async () => {
  const response = await fetch("http://localhost:5000/api/vapid-public-key");
  if (!response.ok) {
    throw new Error("Failed to fetch VAPID public key");
  }
  const data = await response.json();
  return urlBase64ToUint8Array(data.publicKey);
};

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
