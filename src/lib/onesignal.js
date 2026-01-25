import OneSignal from "react-onesignal";

let isInitialized = false;
let initPromise = null;

export const initializeOneSignal = async () => {
  // Prevent multiple initializations
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Check if already initialized
      if (isInitialized) {
        console.log("OneSignal already initialized");
        return true;
      }

      const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;

      if (!appId) {
        console.error("OneSignal App ID not found in environment variables");
        return false;
      }

      console.log("Initializing OneSignal with App ID:", appId);

      // Initialize OneSignal
      await OneSignal.init({
        appId: appId,
        allowLocalhostAsSecureOrigin: true, // PENTING untuk development

        // Service Worker paths
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "/OneSignalSDKWorker.js",

        // Disable automatic prompts
        notifyButton: {
          enable: false,
        },

        promptOptions: {
          slidedown: {
            enabled: false,
          },
        },

        // Disable welcome notification
        welcomeNotification: {
          disable: true,
        },

        // Auto-register (important!)
        autoRegister: false, // Kita handle manual
        autoResubscribe: true,

        // Persistence (important for cross-session)
        persistNotification: true,
      });

      isInitialized = true;
      console.log("✅ OneSignal initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ OneSignal initialization error:", error);
      initPromise = null; // Reset promise untuk retry
      isInitialized = false;
      return false;
    }
  })();

  return initPromise;
};

// Wait for OneSignal to be ready
const waitForOneSignal = async (timeout = 10000) => {
  const startTime = Date.now();

  while (!isInitialized && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  if (!isInitialized) {
    throw new Error(
      "OneSignal initialization timeout - Please check your App ID and allowed domains in OneSignal dashboard",
    );
  }

  return true;
};

// Subscribe user
export const subscribeUser = async (userId, email) => {
  try {
    console.log("Attempting to subscribe user:", userId);
    await waitForOneSignal();

    // Set external user ID untuk targeting
    await OneSignal.login(userId); // Gunakan login() untuk OneSignal v16+
    console.log("✅ External user ID set:", userId);

    // Set email (optional)
    if (email) {
      await OneSignal.User.addEmail(email);
      console.log("✅ Email set:", email);
    }

    // Request permission
    const permission = await OneSignal.Notifications.requestPermission();

    if (permission) {
      console.log("✅ User subscribed to OneSignal");
      return true;
    }

    console.log("⚠️ User denied notification permission");
    return false;
  } catch (error) {
    console.error("❌ Error subscribing user:", error);
    return false;
  }
};

// Unsubscribe user
export const unsubscribeUser = async () => {
  try {
    await waitForOneSignal();
    await OneSignal.User.PushSubscription.optOut();
    console.log("✅ User unsubscribed from OneSignal");
    return true;
  } catch (error) {
    console.error("❌ Error unsubscribing user:", error);
    return false;
  }
};

// Get subscription status
export const getSubscriptionStatus = async () => {
  try {
    await waitForOneSignal();

    // Check if push is supported
    const isPushSupported = OneSignal.Notifications.isPushSupported();
    if (!isPushSupported) {
      return {
        supported: false,
        subscribed: false,
        permission: "unsupported",
      };
    }

    // Get permission status
    const permission = OneSignal.Notifications.permission;
    const isOptedIn = await OneSignal.User.PushSubscription.optedIn;

    return {
      supported: true,
      subscribed: isOptedIn,
      permission: permission
        ? "granted"
        : permission === false
          ? "denied"
          : "default",
    };
  } catch (error) {
    console.error("❌ Error getting subscription status:", error);
    return {
      supported: false,
      subscribed: false,
      permission: "error",
    };
  }
};

// Send notification via OneSignal REST API
export const sendNotification = async (userId, title, message, data = {}) => {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  const restApiKey = import.meta.env.VITE_ONESIGNAL_REST_API_KEY;

  if (!appId || !restApiKey) {
    throw new Error("OneSignal App ID or REST API Key not configured");
  }

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${restApiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_external_user_ids: [userId],
        headings: { en: title },
        contents: { en: message },
        data: data,
        web_url: `${window.location.origin}/app/notifications`,
        chrome_web_icon: `${window.location.origin}/logo.png`,
        chrome_web_badge: `${window.location.origin}/logo.png`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OneSignal API Error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log("✅ Notification sent via REST API:", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
};

// Check if OneSignal is initialized
export const isOneSignalReady = () => isInitialized;
