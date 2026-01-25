import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

// Import icons from react-icons
import {
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";

// Import komponen dari folder mytasks
import TaskSection from "../components/mytasks/TaskSection";
import StatusBadge from "../components/mytasks/StatusBadge";
import TaskCard from "../components/mytasks/TaskCard";
import EditTaskModal from "../components/mytasks/EditTaskModal";
import AddTaskForm from "../components/mytasks/AddTaskForm";

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("23:59"); // TAMBAHAN BARU
  const [categoryId, setCategoryId] = useState("");
  const [editTask, setEditTask] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();

  // Fetch Tasks dan Categories
  useEffect(() => {
    if (!user) return;
    fetchTasks();
    fetchCategories();
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select(`*, category:categories(name)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Organizo - Tugas Saya";
  }, []);
  
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    setCategories(data || []);
  };

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`mytasks-list-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchTasks(),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  const addTask = async () => {
    if (!title || !dueDate || !dueTime) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Judul, tanggal, dan jam deadline harus diisi!",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title,
      description,
      due_date: dueDate,
      due_time: dueTime + ":00", // Format HH:MM:SS
      category_id: categoryId || null,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menambah tugas",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("23:59");
    setCategoryId("");

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Tugas berhasil ditambahkan",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });

    fetchTasks();
  };

  const toggleDone = async (task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_done: !task.is_done })
      .eq("id", task.id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui status tugas",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    fetchTasks();
  };

  const deleteTask = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Tugas?",
      text: "Tugas yang dihapus tidak dapat dikembalikan!",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus tugas",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Terhapus!",
      text: "Tugas berhasil dihapus",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });

    fetchTasks();
  };

  const getTaskDateTime = (task) => {
    return new Date(`${task.due_date}T${task.due_time || "23:59:00"}`);
  };

  const updateTask = async () => {
    if (!editTask) return;

    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTask.title,
        description: editTask.description,
        due_date: editTask.due_date,
        due_time: editTask.due_time,
        category_id: editTask.category_id || null,
      })
      .eq("id", editTask.id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui tugas",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setEditTask(null);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Tugas berhasil diperbarui",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });

    fetchTasks();
  };

  const isTaskOverdue = (task) => {
    if (task.is_done) return false; // Tidak menampilkan tugas yang selesai

    const taskDateTime = new Date(
      `${task.due_date}T${task.due_time || "23:59:00"}`,
    );
    return taskDateTime < now;
  };

  const activeTasks = tasks.filter((task) => {
    if (task.is_done) return false;
    return getTaskDateTime(task) >= now;
  });

  const overdueTasks = tasks.filter((task) => {
    if (task.is_done) return false;
    return getTaskDateTime(task) < now;
  });

  const todayTasks = tasks.filter((task) => {
    if (task.is_done) return false;

    const taskTime = getTaskDateTime(task);
    return task.due_date === today && taskTime >= now;
  });

  const upcomingTasks = tasks.filter((task) => {
    if (task.is_done) return false;

    return task.due_date > today;
  });

  const completedTasks = tasks.filter((task) => task.is_done);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Memuat tugas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header - Responsive */}
        <header className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Tugas Saya
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Kelola dan organisir tugas Anda dengan efisien
            </p>
          </div>

          {/* Status Badges - Responsive Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
            <StatusBadge
              icon={FiClock}
              label="Aktif"
              value={activeTasks.length}
              color="blue"
            />
            {overdueTasks.length > 0 && (
              <StatusBadge
                icon={FiAlertCircle}
                label="Terlambat"
                value={overdueTasks.length}
                color="red"
              />
            )}
          </div>
        </header>

        {/* Form Tambah Tugas */}
        <AddTaskForm
          categories={categories}
          title={title}
          description={description}
          dueDate={dueDate}
          dueTime={dueTime} // ⭐ HARUS ADA INI
          categoryId={categoryId}
          setTitle={setTitle}
          setDescription={setDescription}
          setDueDate={setDueDate}
          setDueTime={setDueTime} // ⭐ HARUS ADA INI
          setCategoryId={setCategoryId}
          addTask={addTask}
        />

        <section className="space-y-6 sm:space-y-10">
          {/* 🔴 TUGAS TERLAMBAT */}
          {overdueTasks.length > 0 && (
            <TaskSection
              title="Tugas Terlambat"
              icon={FiAlertCircle}
              color="red"
              count={overdueTasks.length}
            >
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  overdue
                  toggleDone={toggleDone}
                  setEditTask={setEditTask}
                  deleteTask={deleteTask}
                />
              ))}
            </TaskSection>
          )}

          {/* 🔵 TUGAS HARI INI */}
          {todayTasks.length > 0 && (
            <TaskSection
              title="Tugas Hari Ini"
              icon={FiClock}
              color="blue"
              count={todayTasks.length}
            >
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  overdue={false}
                  toggleDone={toggleDone}
                  setEditTask={setEditTask}
                  deleteTask={deleteTask}
                />
              ))}
            </TaskSection>
          )}

          {/* 🟦 TUGAS MENDATANG */}
          {upcomingTasks.length > 0 && (
            <TaskSection
              title="Tugas Mendatang"
              icon={FiCalendar}
              color="green"
              count={upcomingTasks.length}
            >
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  overdue={false}
                  toggleDone={toggleDone}
                  setEditTask={setEditTask}
                  deleteTask={deleteTask}
                />
              ))}
            </TaskSection>
          )}

          {overdueTasks.length === 0 &&
            todayTasks.length === 0 &&
            upcomingTasks.length === 0 && (
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-8 text-center shadow-md max-w-sm w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Semua tugas selesai!
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Tidak ada tugas aktif, terlambat, atau mendatang saat ini.
                    Nikmati waktu luangmu
                  </p>
                </div>
              </div>
            )}
        </section>

        {/* Modal Edit Task */}
        {editTask && (
          <EditTaskModal
            editTask={editTask}
            setEditTask={setEditTask}
            updateTask={updateTask}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}
