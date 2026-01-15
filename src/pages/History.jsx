import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
  History as HistoryIcon,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  Search,
  MapPin,
  Tag,
  X,
} from "lucide-react";
import TaskModal from "../components/modals/TaskModal";
import ActivityModal from "../components/modals/ActivityModal";

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
              t.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
              a.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2
                size={20}
                className="sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              Tugas
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {totalTasks}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Total Tugas
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${taskCompletionRate}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {taskCompletionRate}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2
                size={20}
                className="sm:w-6 sm:h-6 text-green-600 dark:text-green-400"
              />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Selesai
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {completedTasks}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tugas Selesai
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Calendar
                size={20}
                className="sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400"
              />
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              Kegiatan
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {totalActivities}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Total Kegiatan
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${activityCompletionRate}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {activityCompletionRate}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2
                size={20}
                className="sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400"
              />
            </div>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
              Selesai
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {completedActivities}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Kegiatan Selesai
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
            Status Tugas
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selesai
                </span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {completedTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{
                    width: `${
                      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                    }%`,
                    minWidth:
                      totalTasks > 0 && completedTasks > 0 ? "60px" : "0",
                  }}
                >
                  {completedTasks > 0 && (
                    <span className="text-xs font-bold text-white">
                      {totalTasks > 0
                        ? Math.round((completedTasks / totalTasks) * 100)
                        : 0}
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Belum Selesai
                </span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  {pendingTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{
                    width: `${
                      totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0
                    }%`,
                    minWidth: totalTasks > 0 && pendingTasks > 0 ? "60px" : "0",
                  }}
                >
                  {pendingTasks > 0 && (
                    <span className="text-xs font-bold text-white">
                      {totalTasks > 0
                        ? Math.round((pendingTasks / totalTasks) * 100)
                        : 0}
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Calendar
              size={20}
              className="text-purple-600 dark:text-purple-400"
            />
            Status Kegiatan
          </h3>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  fill="none"
                  stroke="url(#gradient-completed)"
                  strokeWidth="20"
                  strokeDasharray={`${activityCompletionRate * 2.2} 220`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient
                    id="gradient-completed"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {activityCompletionRate}%
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Selesai
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selesai
                </span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {completedActivities}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Belum Selesai
                </span>
              </div>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                {pendingActivities}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari tugas atau kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter("tasks")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "tasks"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Tugas
              </button>
              <button
                onClick={() => setFilter("activities")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "activities"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Kegiatan
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-gray-700 dark:bg-gray-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Selesai
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Belum
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {filteredData().length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon
                size={32}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              Tidak ada data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchQuery
                ? "Tidak ada hasil yang cocok dengan pencarian Anda"
                : "Belum ada tugas atau kegiatan yang tercatat"}
            </p>
          </div>
        ) : (
          filteredData().map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleItemClick(item)}
              className={`bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-lg ${
                item.type === "task"
                  ? item.is_done
                    ? "border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10"
                    : "border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  : item.is_completed
                  ? "border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10"
                  : "border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.type === "task"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      }`}
                    >
                      {item.type === "task" ? "Tugas" : "Kegiatan"}
                    </span>
                    {((item.type === "task" && item.is_done) ||
                      (item.type === "activity" && item.is_completed)) && (
                      <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Selesai
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-bold mb-2 ${
                      (item.type === "task" && item.is_done) ||
                      (item.type === "activity" && item.is_completed)
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {item.type === "task" && item.due_date && (
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg">
                    <Calendar size={12} />
                    <span>{formatDate(item.due_date)}</span>
                  </div>
                )}
                {item.type === "activity" && item.activity_date && (
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg">
                    <Calendar size={12} />
                    <span>{formatDate(item.activity_date)}</span>
                  </div>
                )}

                {item.type === "task" && item.due_time && (
                  <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1.5 rounded-lg">
                    <Clock size={12} />
                    <span>{formatTime(item.due_time)}</span>
                  </div>
                )}
                {item.type === "activity" && item.start_time && (
                  <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1.5 rounded-lg">
                    <Clock size={12} />
                    <span>
                      {formatTime(item.start_time)}
                      {item.end_time && ` - ${formatTime(item.end_time)}`}
                    </span>
                  </div>
                )}

                {item.type === "activity" && item.location && (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1.5 rounded-lg">
                    <MapPin size={12} />
                    <span className="truncate max-w-[150px]">
                      {item.location}
                    </span>
                  </div>
                )}

                {item.categories && (
                  <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1.5 rounded-lg">
                    <Tag size={12} />
                    <span>{item.categories.name}</span>
                  </div>
                )}
              </div>
            </div>
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
