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
          {/* Notifications Card */}
          <Card title="Notifikasi" icon={AlertCircle}>
            {todayTasks.length === 0 &&
            overdueTasks.length === 0 &&
            todayActivities.length === 0 ? (
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-green-600 dark:text-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="font-semibold">
                    Semua tugas & kegiatan terkendali! 🎉
                  </p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80 hidden sm:block">
                    Tidak ada tugas atau kegiatan yang mendesak
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {overdueTasks.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {overdueTasks.length} tugas terlambat
                      </p>
                      <p className="text-xs text-red-600/80 dark:text-red-400/80 hidden sm:block">
                        Segera selesaikan untuk tetap produktif
                      </p>
                    </div>
                  </div>
                )}

                {todayTasks.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {todayTasks.length} tugas deadline hari ini
                      </p>
                      <p className="text-xs text-yellow-700/80 dark:text-yellow-400/80 hidden sm:block">
                        Fokus pada prioritas utama
                      </p>
                    </div>
                  </div>
                )}

                {todayActivities.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <Calendar size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {todayActivities.length} kegiatan hari ini
                      </p>
                      <p className="text-xs text-blue-700/80 dark:text-blue-400/80 hidden sm:block">
                        Cek jadwal kegiatan Anda hari ini
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Today's Activities Card */}
          <Card title="Kegiatan Hari Ini" icon={Calendar}>
            {todayActivities.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Calendar
                    size={20}
                    className="sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Tidak ada kegiatan hari ini
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 hidden sm:block">
                  Tambahkan kegiatan untuk mengatur jadwal
                </p>
              </div>
            ) : (
              <ul className="space-y-1.5 sm:space-y-2">
                {todayActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50 dark:hover:from-blue-900/20 dark:hover:to-sky-900/20 transition-all cursor-pointer group"
                  >
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 ${
                        activity.is_completed
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-blue-400 to-sky-500"
                      } group-hover:scale-125 transition-transform`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <span
                          className={`text-xs sm:text-sm font-medium truncate ${
                            activity.is_completed
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {activity.title}
                        </span>
                        {activity.start_time && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                            {activity.start_time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                      {activity.categories && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full inline-block">
                          {activity.categories.name}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right Section - Calendar */}
        <CalendarCard title="Kalender" />
      </div>
    </div>
  );
}
