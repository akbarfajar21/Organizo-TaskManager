import { useState, useEffect } from "react";

export const useIOSPushNotification = () => {
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  // Cek apakah iOS dan mendukung push
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  useEffect(() => {
    const checkSupport = async () => {
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      setIsSupported(supported);

      if (supported && isIOS()) {
        console.log("iOS Push Notification supported!");
      }
    };

    checkSupport();
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
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
  };

  const subscribeToPush = async () => {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      let sub = await registration.pushManager.getSubscription();

      if (!sub) {
        // Subscribe to push
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
          throw new Error("VAPID public key not found");
        }

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });

        console.log("New push subscription:", sub);
      }

      setSubscription(sub);

      // Kirim subscription ke server/Supabase untuk disimpan
      // Anda perlu menyimpan ini di database
      return sub;
    } catch (err) {
      console.error("Error subscribing to push:", err);
      setError(err.message);
      return null;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
      }
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setError(err.message);
    }
  };

  return {
    subscription,
    isSupported,
    isIOS: isIOS(),
    error,
    subscribeToPush,
    unsubscribeFromPush,
  };
};
