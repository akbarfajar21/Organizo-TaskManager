import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { History as HistoryIcon, CheckCircle2, Calendar } from "lucide-react";
import TaskModal from "../components/modals/TaskModal";
import ActivityModal from "../components/modals/ActivityModal";
import StatisticsCard from "../components/history/StatisticsCard";
import TaskStatusChart from "../components/history/TaskStatusChart";
import ActivityStatusChart from "../components/history/ActivityStatusChart";
import HistoryFilter from "../components/history/HistoryFilter";
import HistoryItem from "../components/history/HistoryItem";
import EmptyState from "../components/history/EmptyState";

export default function History() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [tasksRes, activitiesRes] = await Promise.all([
      supabase
        .from("tasks")
        .select("*, categories(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activities")
        .select("*, categories(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (!tasksRes.error) setTasks(tasksRes.data || []);
    if (!activitiesRes.error) setActivities(activitiesRes.data || []);
    setLoading(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.is_done).length;
  const pendingTasks = totalTasks - completedTasks;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.is_completed).length;
  const pendingActivities = totalActivities - completedActivities;
  const activityCompletionRate =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  const filteredData = () => {
    let data = [];

    if (filter === "all" || filter === "tasks") {
      const filteredTasks = tasks
        .filter((t) => {
          if (statusFilter === "completed") return t.is_done;
          if (statusFilter === "pending") return !t.is_done;
          return true;
        })
        .filter(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description &&
              t.description.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .map((t) => ({ ...t, type: "task" }));
      data = [...data, ...filteredTasks];
    }

    if (filter === "all" || filter === "activities") {
      const filteredActivities = activities
        .filter((a) => {
          if (statusFilter === "completed") return a.is_completed;
          if (statusFilter === "pending") return !a.is_completed;
          return true;
        })
        .filter(
          (a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.description &&
              a.description.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .map((a) => ({ ...a, type: "activity" }));
      data = [...data, ...filteredActivities];
    }

    return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const handleItemClick = (item) => {
    if (item.type === "task") {
      setSelectedTask(item);
      setIsTaskModalOpen(true);
    } else {
      setSelectedActivity(item);
      setIsActivityModalOpen(true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Memuat riwayat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
            <HistoryIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Riwayat
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Semua tugas dan kegiatan Anda
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatisticsCard
          icon={CheckCircle2}
          title="Tugas"
          total={totalTasks}
          label="Total Tugas"
          showProgress={true}
          progressRate={taskCompletionRate}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          badgeColor="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
          badgeText="Tugas"
        />

        <StatisticsCard
          icon={CheckCircle2}
          title="Selesai"
          total={completedTasks}
          label="Tugas Selesai"
          showProgress={false}
          bgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          badgeColor="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
          badgeText="Selesai"
        />

        <StatisticsCard
          icon={Calendar}
          title="Kegiatan"
          total={totalActivities}
          label="Total Kegiatan"
          showProgress={true}
          progressRate={activityCompletionRate}
          bgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          badgeColor="text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30"
          badgeText="Kegiatan"
        />

        <StatisticsCard
          icon={CheckCircle2}
          title="Selesai"
          total={completedActivities}
          label="Kegiatan Selesai"
          showProgress={false}
          bgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
          badgeColor="text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30"
          badgeText="Selesai"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <TaskStatusChart
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          totalTasks={totalTasks}
        />

        <ActivityStatusChart
          completedActivities={completedActivities}
          pendingActivities={pendingActivities}
          activityCompletionRate={activityCompletionRate}
        />
      </div>

      {/* Filters & Search */}
      <HistoryFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* List Items */}
      <div className="space-y-3">
        {filteredData().length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          filteredData().map((item) => (
            <HistoryItem
              key={`${item.type}-${item.id}`}
              item={item}
              onClick={() => handleItemClick(item)}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {isTaskModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdate={fetchData}
        />
      )}

      {isActivityModalOpen && selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => {
            setIsActivityModalOpen(false);
            setSelectedActivity(null);
          }}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
