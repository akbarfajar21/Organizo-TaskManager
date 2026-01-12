import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ TAMBAH INI

// Fungsi konversi VAPID key
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

// ✅ MODIFIKASI: Tambah parameter userId
async function subscribeUserToPush(userId) {
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

      // ✅ PENTING: Kirim subscription + userId
      await fetch("http://localhost:4000/api/save-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription, // ✅ subscription object
          userId, // ✅ user id dari Supabase
        }),
      });

      console.log("✅ User subscribed to push notifications:", userId);
    } catch (error) {
      console.error("❌ Failed to subscribe the user:", error);
    }
  }
}

export default function DashboardLayout() {
  const { user } = useAuth(); // ✅ TAMBAH INI untuk mendapatkan user.id

  useEffect(() => {
    // ✅ MODIFIKASI: Pastikan user sudah login dulu
    if (
      user?.id && // ✅ Tunggu sampai user login
      "Notification" in window &&
      navigator.serviceWorker &&
      !localStorage.getItem(`subscribed_${user.id}`) // ✅ Per user, bukan global
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          subscribeUserToPush(user.id); // ✅ Kirim userId
          localStorage.setItem(`subscribed_${user.id}`, "true"); // ✅ Simpan per user
        }
      });
    }
  }, [user?.id]); // ✅ PENTING: Jalankan ulang saat user login/logout

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
