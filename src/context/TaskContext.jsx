import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Ambil user_id dengan autentikasi
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser(); // ✅ Ubah destructuring

      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.user) {
        // ✅ Cek data.user
        const userId = data.user.id; // ✅ Akses user.id dari data.user
        fetchTasks(userId);
      } else {
        console.error("User is not authenticated");
      }
    };

    fetchUser();
  }, []);

  // Fungsi untuk mengambil tugas berdasarkan user_id (UUID)
  const fetchTasks = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined or invalid");
      return; // Jangan lanjutkan jika userId tidak valid
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId); // Gunakan UUID di sini

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    // Misalnya, cek deadline tugas setiap detik atau menggunakan interval
    const checkDeadlines = async () => {
      const now = new Date().getTime();

      for (let task of tasks) {
        const deadline = new Date(task.due_date).getTime();

        // Cek pengingat apakah sudah dikirimkan untuk 1 hari sebelumnya
        if (
          deadline - now <= 24 * 60 * 60 * 1000 &&
          deadline - now > 0 &&
          !task.notified_day
        ) {
          toast.info(
            `Pengingat: Tugas "${task.title}" akan jatuh tempo besok!`
          );
          await updateNotificationStatus(task.id, "notified_day");
        }

        // Cek pengingat apakah sudah dikirimkan untuk hari H
        if (
          deadline - now <= 0 &&
          deadline - now > -24 * 60 * 60 * 1000 &&
          !task.notified_day
        ) {
          toast.info(`Pengingat: Tugas "${task.title}" jatuh tempo hari ini!`);
          await updateNotificationStatus(task.id, "notified_day");
        }

        // Cek pengingat apakah sudah dikirimkan untuk 1 jam sebelumnya
        if (
          deadline - now <= 60 * 60 * 1000 &&
          deadline - now > 0 &&
          !task.notified_1hour
        ) {
          toast.info(
            `Pengingat: Tugas "${task.title}" jatuh tempo dalam satu jam!`
          );
          await updateNotificationStatus(task.id, "notified_1hour");
        }
      }
    };

    // Cek deadline setiap menit (atau sesuaikan interval sesuai kebutuhan)
    const interval = setInterval(checkDeadlines, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  // Fungsi untuk memperbarui status pengingat di database
  const updateNotificationStatus = async (taskId, notificationType) => {
    const { data, error } = await supabase
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
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
