import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect } from "react";

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

async function subscribeUserToPush() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const publicVapidKey =
      "BEHBUndRudn48qXVedVxoMAqLPLnRWVTI5NwD6faPnSpSL9nagJLdyEc1bRS1VnUhWreNhSk98RLWcNBg1iuDHo";
    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Kirim subscription ke backend
      await fetch("http://localhost:4000/api/save-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      console.log("User is subscribed to push notifications");
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
    }
  }
}

export default function DashboardLayout() {
  useEffect(() => {
    if ("Notification" in window && navigator.serviceWorker) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          subscribeUserToPush();
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
