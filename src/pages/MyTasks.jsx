import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

// Import icons from react-icons
import { FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

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
  const [categoryId, setCategoryId] = useState("");
  const [editTask, setEditTask] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

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
        () => fetchTasks()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  const addTask = async () => {
    if (!title || !dueDate) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Judul dan deadline harus diisi!",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title,
      description,
      due_date: dueDate,
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

    // Reset form fields after successful task creation
    setTitle("");
    setDescription("");
    setDueDate("");
    setCategoryId("");

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Tugas berhasil ditambahkan",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });

    fetchTasks(); // Reload tasks
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

    // After updating, fetch tasks again to get the latest state
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

    fetchTasks(); // Reload tasks after deletion
  };

  const updateTask = async () => {
    if (!editTask) return; // Pastikan editTask ada

    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTask.title,
        description: editTask.description,
        due_date: editTask.due_date,
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

    // Setelah tugas diupdate, reset editTask dan muat ulang daftar tugas
    setEditTask(null);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Tugas berhasil diperbarui",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });

    fetchTasks(); // Muat ulang daftar tugas
  };

  const activeTasks = tasks.filter((t) => !t.is_done && t.due_date >= today);
  const overdueTasks = tasks.filter((t) => !t.is_done && t.due_date < today);
  const completedTasks = tasks.filter((t) => t.is_done);

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
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Tugas Saya
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola dan organisir tugas Anda dengan efisien
            </p>
          </div>
          <div className="flex gap-4">
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
            <StatusBadge
              icon={FiCheckCircle}
              label="Selesai"
              value={completedTasks.length}
              color="green"
            />
          </div>
        </header>

        {/* Form Tambah Tugas */}
        <AddTaskForm
          categories={categories}
          title={title}
          description={description}
          dueDate={dueDate}
          categoryId={categoryId}
          setTitle={setTitle}
          setDescription={setDescription}
          setDueDate={setDueDate}
          setCategoryId={setCategoryId}
          addTask={addTask}
        />

        {/* Task List */}
        <section className="space-y-10">
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
                  toggleDone={toggleDone}
                  setEditTask={setEditTask}
                  deleteTask={deleteTask}
                />
              ))}
            </TaskSection>
          )}
          {activeTasks.length > 0 && (
            <TaskSection
              title="Tugas Aktif"
              icon={FiClock}
              color="blue"
              count={activeTasks.length}
            >
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  toggleDone={toggleDone}
                  setEditTask={setEditTask}
                  deleteTask={deleteTask}
                />
              ))}
            </TaskSection>
          )}
          {completedTasks.length > 0 && (
            <TaskSection
              title="Tugas Selesai"
              icon={FiCheckCircle}
              color="green"
              count={completedTasks.length}
            >
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  toggleDone={toggleDone}
                  setEditTask={setEditTask}
                  deleteTask={deleteTask}
                />
              ))}
            </TaskSection>
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
