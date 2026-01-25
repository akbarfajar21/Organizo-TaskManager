import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeUser,
  unsubscribeUser,
  getSubscriptionStatus,
  isOneSignalReady,
} from "../lib/onesignal";

export const useOneSignal = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState({
    supported: false,
    subscribed: false,
    permission: "default",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      // Wait for OneSignal to be ready
      const maxAttempts = 20; // 20 attempts * 250ms = 5 seconds
      let attempts = 0;

      while (!isOneSignalReady() && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        attempts++;
      }

      if (!isMounted) return;

      if (!isOneSignalReady()) {
        console.warn("OneSignal not ready after timeout");
        setLoading(false);
        return;
      }

      const currentStatus = await getSubscriptionStatus();

      if (isMounted) {
        setStatus(currentStatus);
        setLoading(false);
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const enableNotifications = async () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const success = await subscribeUser(user.id, user.email);

    if (success) {
      const newStatus = await getSubscriptionStatus();
      setStatus(newStatus);
    }

    return success;
  };

  const disableNotifications = async () => {
    const success = await unsubscribeUser();

    if (success) {
      const newStatus = await getSubscriptionStatus();
      setStatus(newStatus);
    }

    return success;
  };

  return {
    ...status,
    loading,
    enableNotifications,
    disableNotifications,
  };
};
