// src/utils/serviceWorkerHelper.js

export const sendUserIdToServiceWorker = (userId) => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SET_USER_ID",
      userId: userId,
    });
  }
};

export const requestNotificationCheck = () => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CHECK_NOTIFICATIONS",
    });
  }
};

// Setup message handler untuk service worker
export const setupServiceWorkerMessageHandler = (onUserIdRequest) => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "GET_USER_ID") {
        const userId = onUserIdRequest();
        if (event.ports[0] && userId) {
          event.ports[0].postMessage({ userId });
        }
      }
    });
  }
};
