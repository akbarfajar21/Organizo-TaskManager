import { useState, useEffect } from "react";

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported("Notification" in window && "serviceWorker" in navigator);
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      console.log("Notifications not supported");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    isGranted: permission === "granted",
  };
};
