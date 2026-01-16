import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

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
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.user) {
        const userId = data.user.id;
        fetchTasks(userId);
      } else {
        console.error("User is not authenticated");
      }
    };

    fetchUser();
  }, [fetchTasks]);

  const sendPushNotification = async (title, body) => {
    try {
      await fetch("http://localhost:5000/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, link: "/app/tasks" }),
      });
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
      console.error(`Error updating notification status:`, error);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [notificationType]: true } : task
        )
      );
    }
  };

  // ✅ Fungsi untuk reset notifikasi saat tugas completed
  const resetNotifications = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        notified_day: false,
        notified_today: false,
        notified_1hour: false,
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error resetting notifications:", error);
    }
  };

  useEffect(() => {
    const checkDeadlines = async () => {
      const now = new Date().getTime();

      // ✅ Filter hanya tugas yang pending
      const pendingTasks = tasks.filter(
        (task) => task.status === "pending" || !task.status
      );

      for (let task of pendingTasks) {
        const deadline = new Date(task.due_date).getTime();

        // ✅ Skip jika deadline sudah lewat lebih dari 24 jam
        if (now - deadline > 24 * 60 * 60 * 1000) {
          continue;
        }

        // Notifikasi 1 hari sebelumnya
        if (
          deadline - now <= 24 * 60 * 60 * 1000 &&
          deadline - now > 60 * 60 * 1000 && // Lebih dari 1 jam
          !task.notified_day
        ) {
          const message = `Pengingat: Tugas "${task.title}" akan jatuh tempo besok!`;
          toast.info(message);
          await sendPushNotification("Pengingat Tugas", message);
          await updateNotificationStatus(task.id, "notified_day");
        }

        // Notifikasi 1 jam sebelumnya
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

        // Notifikasi hari H (saat deadline tiba)
        if (
          deadline - now <= 0 &&
          deadline - now > -60 * 60 * 1000 && // Dalam 1 jam terakhir
          !task.notified_today
        ) {
          const message = `Pengingat: Tugas "${task.title}" jatuh tempo sekarang!`;
          toast.error(message);
          await sendPushNotification("Tugas Jatuh Tempo", message);
          await updateNotificationStatus(task.id, "notified_today");
        }
      }
    };

    // ✅ Jalankan pertama kali
    checkDeadlines();

    // ✅ Cek setiap 5 menit (bukan 1 menit untuk mengurangi beban)
    const interval = setInterval(checkDeadlines, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        fetchTasks,
        resetNotifications,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
