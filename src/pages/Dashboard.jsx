import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import SummaryCard from "../components/dashboard/SummaryCard";
import Card from "../components/dashboard/Card";
import CalendarCard from "../components/dashboard/CalendarCard";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [previousTasks, setPreviousTasks] = useState([]);
  const [todayActivities, setTodayActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const fetchTodayActivities = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("activities")
      .select("*, categories(name)")
      .eq("user_id", user.id)
      .eq("activity_date", today)
      .order("start_time", { ascending: true });
    if (!error) {
      setTodayActivities(data || []);
    }
  };

  useEffect(() => {
    if (!user) return;

    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error) {
          setTasks(data || []);
          setLoading(false);
        }
      });

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .slice(0, 10);
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .lte("created_at", sevenDaysAgo)
      .then(({ data, error }) => {
        if (!error) {
          setPreviousTasks(data || []);
        }
      });
  }, [user]);

  useEffect(() => {
    fetchTodayActivities();
  }, [user, today]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-dashboard-tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .then(({ data }) => setTasks(data || []));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-dashboard-activities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTodayActivities();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, today]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.is_done).length;
  const todayTasks = tasks.filter((t) => t.due_date === today && !t.is_done);
  const overdueTasks = tasks.filter((t) => t.due_date < today && !t.is_done);
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const previousTotal = previousTasks.length;
  const previousTodayTasks = previousTasks.filter(
    (t) => t.due_date === yesterday && !t.is_done
  );
  const previousOverdueTasks = previousTasks.filter(
    (t) => t.due_date < yesterday && !t.is_done
  );

  const calculateTrend = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? "+100%" : "0%";
    }
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const totalTrend = calculateTrend(total, previousTotal);
  const todayTrend = calculateTrend(
    todayTasks.length,
    previousTodayTasks.length
  );
  const overdueTrend =
    overdueTasks.length === 0
      ? "Bagus!"
      : overdueTasks.length > previousOverdueTasks.length
      ? "Perlu perhatian"
      : "Membaik";
  const completionTrend = `${completionRate}%`;

  useEffect(() => {
    if (loading) return;
    if (overdueTasks.length > 0) {
      showToast({
        type: "error",
        message: `${overdueTasks.length} tugas overdue`,
        link: "/app/tasks",
        oncePerDay: true,
      });
    } else if (todayTasks.length > 0) {
      showToast({
        type: "warning",
        message: `${todayTasks.length} tugas deadline hari ini`,
        link: "/app/tasks",
        oncePerDay: true,
      });
    }
  }, [loading, todayTasks.length, overdueTasks.length, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header - Responsive */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Selamat datang kembali! Berikut ringkasan tugas Anda hari ini.
        </p>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Tugas"
          value={total}
          icon={ListTodo}
          gradient="from-blue-500 to-blue-600"
          bgColor="bg-white dark:bg-gray-800"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={totalTrend}
          trendType={
            totalTrend.includes("+")
              ? "up"
              : totalTrend.includes("-")
              ? "down"
              : "neutral"
          }
        />
        <SummaryCard
          title="Hari Ini"
          value={todayTasks.length}
          icon={Clock}
          gradient="from-yellow-400 to-amber-500"
          bgColor="bg-white dark:bg-gray-800"
          iconColor="text-yellow-600 dark:text-yellow-400"
          trend={todayTrend}
          trendType={
            todayTrend.includes("+")
              ? "up"
              : todayTrend.includes("-")
              ? "down"
              : "neutral"
          }
        />
        <SummaryCard
          title="Terlambat"
          value={overdueTasks.length}
          icon={AlertCircle}
          gradient="from-red-500 to-red-600"
          bgColor="bg-white dark:bg-gray-800"
          iconColor="text-red-600 dark:text-red-400"
          trend={overdueTrend}
          trendType={
            overdueTrend === "Bagus!"
              ? "good"
              : overdueTrend === "Perlu perhatian"
              ? "bad"
              : "neutral"
          }
        />
        <SummaryCard
          title="Selesai"
          value={`${done}/${total}`}
          icon={CheckCircle2}
          gradient="from-green-500 to-green-600"
          bgColor="bg-white dark:bg-gray-800"
          iconColor="text-green-600 dark:text-green-400"
          trend={completionTrend}
          trendType="neutral"
        />
        <SummaryCard
          title="Kegiatan Hari Ini"
          value={todayActivities.length}
          icon={Calendar}
          gradient="from-blue-500 to-indigo-600"
          bgColor="bg-white dark:bg-gray-800"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={`${
            todayActivities.filter((a) => a.is_completed).length
          } selesai`}
          trendType="neutral"
        />
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Section - Notifications & Activities */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* ⭐ NOTIFICATIONS CARD - ENHANCED */}
          <Card title="Notifikasi" icon={AlertCircle}>
            {todayTasks.length === 0 &&
            overdueTasks.length === 0 &&
            todayActivities.length === 0 ? (
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-green-600 dark:text-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm sm:text-base mb-0.5">
                    Semua tugas & kegiatan terkendali! 🎉
                  </p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80">
                    Tidak ada tugas atau kegiatan yang mendesak hari ini
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Overdue Tasks - ENHANCED */}
                {overdueTasks.length > 0 && (
                  <div className="group">
                    <div className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <AlertCircle size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-sm sm:text-base">
                            {overdueTasks.length} Tugas Terlambat
                          </p>
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                            Urgent
                          </span>
                        </div>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-2">
                          Segera selesaikan untuk tetap produktif
                        </p>
                        {/* Detail Tugas Terlambat */}
                        <div className="space-y-1.5 mt-2">
                          {overdueTasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-2 text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg"
                            >
                              <div className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                              <span className="flex-1 truncate font-medium">
                                {task.title}
                              </span>
                              <span className="text-red-500 flex-shrink-0">
                                {new Date(task.due_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </span>
                            </div>
                          ))}
                          {overdueTasks.length > 3 && (
                            <p className="text-xs text-red-500 font-medium text-center pt-1">
                              +{overdueTasks.length - 3} tugas lainnya
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Today's Tasks - ENHANCED */}
                {todayTasks.length > 0 && (
                  <div className="group">
                    <div className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Clock size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-sm sm:text-base">
                            {todayTasks.length} Tugas Deadline Hari Ini
                          </p>
                          <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full font-semibold">
                            Today
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700/80 dark:text-yellow-400/80 mb-2">
                          Fokus pada prioritas utama hari ini
                        </p>
                        {/* Detail Tugas Hari Ini */}
                        <div className="space-y-1.5 mt-2">
                          {todayTasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-2 text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg"
                            >
                              <div className="w-1 h-1 rounded-full bg-yellow-500 flex-shrink-0" />
                              <span className="flex-1 truncate font-medium">
                                {task.title}
                              </span>
                              {task.due_time && (
                                <span className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 flex items-center gap-1">
                                  <Clock size={10} />
                                  {task.due_time.slice(0, 5)}
                                </span>
                              )}
                            </div>
                          ))}
                          {todayTasks.length > 3 && (
                            <p className="text-xs text-yellow-600 font-medium text-center pt-1">
                              +{todayTasks.length - 3} tugas lainnya
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Today's Activities - ENHANCED */}
                {todayActivities.length > 0 && (
                  <div className="group">
                    <div className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Calendar size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-sm sm:text-base">
                            {todayActivities.length} Kegiatan Hari Ini
                          </p>
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
                            Schedule
                          </span>
                        </div>
                        <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mb-2">
                          Cek jadwal kegiatan Anda hari ini
                        </p>
                        {/* Detail Kegiatan Hari Ini */}
                        <div className="space-y-1.5 mt-2">
                          {todayActivities.slice(0, 3).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-2 text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg"
                            >
                              <div className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                              <span className="flex-1 truncate font-medium">
                                {activity.title}
                              </span>
                              {activity.start_time && (
                                <span className="text-blue-600 dark:text-blue-500 flex-shrink-0 flex items-center gap-1">
                                  <Clock size={10} />
                                  {activity.start_time.slice(0, 5)}
                                </span>
                              )}
                            </div>
                          ))}
                          {todayActivities.length > 3 && (
                            <p className="text-xs text-blue-600 font-medium text-center pt-1">
                              +{todayActivities.length - 3} kegiatan lainnya
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* ⭐ TODAY'S ACTIVITIES CARD - ENHANCED */}
          <Card title="Kegiatan Hari Ini" icon={Calendar}>
            {todayActivities.length === 0 ? (
              <div className="text-center py-8 sm:py-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Calendar
                    size={24}
                    className="sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500"
                  />
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Tidak ada kegiatan hari ini
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Tambahkan kegiatan untuk mengatur jadwal Anda
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`group relative flex items-start gap-3 p-3 sm:p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                      activity.is_completed
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-sky-100 dark:hover:from-blue-900/30 dark:hover:to-sky-900/30"
                    }`}
                  >
                    {/* Status Indicator */}
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.is_completed
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-blue-400 to-sky-500 animate-pulse"
                      } group-hover:scale-125 transition-transform`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={`text-sm sm:text-base font-bold ${
                            activity.is_completed
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {activity.title}
                        </h4>
                        {activity.is_completed && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2">
                            ✓ Selesai
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {activity.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {activity.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {/* Time */}
                        {activity.start_time && (
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                              activity.is_completed
                                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                                : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            <Clock size={12} />
                            <span className="font-medium">
                              {activity.start_time.slice(0, 5)}
                              {activity.end_time &&
                                ` - ${activity.end_time.slice(0, 5)}`}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        {activity.location && (
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                            <MapPin size={12} />
                            <span className="font-medium truncate max-w-[120px]">
                              {activity.location}
                            </span>
                          </div>
                        )}

                        {/* Category */}
                        {activity.categories && (
                          <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-lg">
                            <Tag size={12} />
                            <span className="font-medium">
                              {activity.categories.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Section - Calendar */}
        <CalendarCard title="Kalender" />
      </div>
    </div>
  );
}
