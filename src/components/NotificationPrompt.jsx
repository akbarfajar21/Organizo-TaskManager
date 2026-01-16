import React, { useState, useEffect } from "react";
import { requestNotificationPermission } from "../notifications";

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // ✅ Cek apakah permission belum diberikan
    if (Notification.permission === "default") {
      // Tampilkan prompt setelah 3 detik (agar tidak mengganggu)
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
    setPermission(Notification.permission);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Simpan ke localStorage agar tidak muncul lagi
    localStorage.setItem("notificationPromptDismissed", "true");
  };

  // ✅ Jangan tampilkan jika sudah granted atau user dismiss
  if (
    permission === "granted" ||
    permission === "denied" ||
    localStorage.getItem("notificationPromptDismissed") === "true"
  ) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: "350px",
        zIndex: 9999,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
        <div style={{ fontSize: "24px" }}>🔔</div>
        <div style={{ flex: 1 }}>
          <h3
            style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600" }}
          >
            Aktifkan Notifikasi
          </h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#666" }}>
            Dapatkan pengingat untuk tugas yang akan jatuh tempo
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleEnableNotifications}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Aktifkan
            </button>
            <button
              onClick={handleDismiss}
              style={{
                padding: "10px 16px",
                backgroundColor: "#f0f0f0",
                color: "#666",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
