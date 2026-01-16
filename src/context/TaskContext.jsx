import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

const TaskContext = createContext();

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://beckend-notification-organizo.vercel.app";

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const fetchTasks = useCallback(async (userId) => {
    if (!userId) {
      console.error("User ID is undefined or invalid");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
      } else if (user) {
        setUser(user);
        fetchTasks(user.id);
      } else {
        console.error("User is not authenticated");
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
          fetchTasks(session.user.id);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchTasks]);

  // Notifikasi ke server - PERBAIKAN DI SINI
  const sendPushNotification = async (title, body) => {
    // Cek apakah user sudah subscribe
    if (!isSubscribed) {
      console.log("User belum subscribe ke push notifications");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, link: "/app/tasks" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Push notification sent successfully");
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  const updateNotificationStatus = async (taskId, notificationType) => {
    const { error } = await supabase
      .from("tasks")
      .update({ [notificationType]: true })
      .eq("id", taskId);

    if (error) {
      console.error(
        `Error updating notification status for task ${taskId}:`,
        error
      );
    } else {
      console.log(`Notification status updated for task ${taskId}`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [notificationType]: true } : task
        )
      );
    }
  };

  const resetNotifications = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        notified_day: false,
        notified_1hour: false,
        notified_h1: false,
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error resetting notifications:", error);
    }
  };

  // Cek status subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
          console.log("Subscription status:", !!subscription);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    const checkDeadlines = async () => {
      const now = new Date().getTime();

      const pendingTasks = tasks.filter(
        (task) => task.status === "pending" || !task.status
      );

      for (let task of pendingTasks) {
        const deadline = new Date(task.due_date).getTime();

        // Skip jika deadline sudah lewat lebih dari 24 jam
        if (now - deadline > 24 * 60 * 60 * 1000) {
          continue;
        }

        // 1 hari sebelum (24 jam sebelum deadline)
        if (
          deadline - now <= 24 * 60 * 60 * 1000 &&
          deadline - now > 60 * 60 * 1000 &&
          !task.notified_h1
        ) {
          const message = `Pengingat: Tugas "${task.title}" akan jatuh tempo besok!`;
          toast.info(message);
          await sendPushNotification("Pengingat Tugas", message);
          await updateNotificationStatus(task.id, "notified_h1");
        }

        // 1 jam sebelum
        if (
          deadline - now <= 60 * 60 * 1000 &&
          deadline - now > 0 &&
          !task.notified_1hour
        ) {
          const message = `Pengingat: Tugas "${task.title}" jatuh tempo dalam 1 jam!`;
          toast.warning(message);
          await sendPushNotification("Tugas Mendesak", message);
          await updateNotificationStatus(task.id, "notified_1hour");
        }

        // Saat deadline
        if (
          deadline - now <= 0 &&
          deadline - now > -60 * 60 * 1000 &&
          !task.notified_day
        ) {
          const message = `Pengingat: Tugas "${task.title}" jatuh tempo sekarang!`;
          toast.error(message);
          await sendPushNotification("Tugas Jatuh Tempo", message);
          await updateNotificationStatus(task.id, "notified_day");
        }
      }
    };

    if (tasks.length > 0) {
      checkDeadlines();
    }

    // Ubah interval menjadi 60000 (1 menit) untuk production
    const interval = setInterval(checkDeadlines, 60000);

    return () => clearInterval(interval);
  }, [tasks, isSubscribed]); // Tambahkan isSubscribed sebagai dependency

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        fetchTasks,
        resetNotifications,
        isSubscribed,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
