import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Tag,
} from "lucide-react";
import Card from "../../components/dashboard/Card";
import { supabase } from "../../lib/supabase";

const CalendarCard = ({ title }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const fetchData = useCallback(async () => {
    if (!user) return;
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth}`;

    const [tasksRes, activitiesRes] = await Promise.all([
      supabase
        .from("tasks")
        .select(
          "id, title, description, due_date, due_time, is_done, category:categories(name)"
        )
        .eq("user_id", user.id)
        .gte("due_date", start)
        .lte("due_date", end),
      supabase
        .from("activities")
        .select(
          "id, title, description, activity_date, start_time, end_time, location, is_completed, category:categories(name)"
        )
        .eq("user_id", user.id)
        .gte("activity_date", start)
        .lte("activity_date", end),
    ]);
    if (!tasksRes.error) setTasks(tasksRes.data || []);
    if (!activitiesRes.error) setActivities(activitiesRes.data || []);
  }, [user, year, month, daysInMonth]);

  useEffect(() => {
    fetchData();
    setSelectedDate(null);
  }, [fetchData]);

  useEffect(() => {
    if (!user) return;

    const channelTasks = supabase
      .channel("realtime-calendar-tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        fetchData
      )
      .subscribe();

    const channelActivities = supabase
      .channel("realtime-calendar-activities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `user_id=eq.${user.id}`,
        },
        fetchData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelTasks);
      supabase.removeChannel(channelActivities);
    };
  }, [user, fetchData]);

  const tasksByDate = tasks.reduce((acc, t) => {
    acc[t.due_date] = acc[t.due_date] || [];
    acc[t.due_date].push(t);
    return acc;
  }, {});

  const activitiesByDate = activities.reduce((acc, a) => {
    acc[a.activity_date] = acc[a.activity_date] || [];
    acc[a.activity_date].push(a);
    return acc;
  }, {});

  // Format waktu
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5); // HH:MM
  };

  return (
    <Card title={title} icon={Clock}>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 flex items-center justify-center transition-colors"
        >
          <ChevronLeft
            size={16}
            className="sm:w-[18px] sm:h-[18px] text-gray-600 dark:text-gray-300"
          />
        </button>
        <span className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 capitalize">
          {currentDate.toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 flex items-center justify-center transition-colors"
        >
          <ChevronRight
            size={16}
            className="sm:w-[18px] sm:h-[18px] text-gray-600 dark:text-gray-300"
          />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <span
            key={d}
            className="font-bold text-gray-500 dark:text-gray-400 py-1 sm:py-2"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const dayTasks = tasksByDate[dateStr] || [];
          const dayActivities = activitiesByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`relative py-1.5 sm:py-2 rounded-lg font-semibold transition-all
                ${
                  isToday
                    ? "border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-white dark:bg-gray-900 z-10"
                    : isSelected
                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 ring-2 ring-yellow-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {day}
              {/* Indicator Dots */}
              <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 flex gap-0.5 -translate-x-1/2">
                {dayTasks.length > 0 && (
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500" />
                )}
                {dayActivities.length > 0 && (
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ⭐ DETAIL LENGKAP UNTUK TANGGAL YANG DIPILIH */}
      {selectedDate && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 max-h-[400px] overflow-y-auto">
          <h4 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <CalendarIcon size={16} />
            {new Date(selectedDate).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h4>

          {/* ⭐ DETAIL TUGAS */}
          {tasksByDate[selectedDate] &&
            tasksByDate[selectedDate].length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                  📋 Tugas ({tasksByDate[selectedDate].length})
                </p>
                <div className="space-y-2">
                  {tasksByDate[selectedDate].map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        task.is_done
                          ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                          : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h5
                          className={`font-semibold text-sm ${
                            task.is_done
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {task.title}
                        </h5>
                        {task.is_done && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Selesai
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs">
                        {/* Deadline Jam */}
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock size={12} />
                          <span>
                            Deadline: {formatTime(task.due_time) || "23:59"}
                          </span>
                        </div>

                        {/* Kategori */}
                        {task.category && (
                          <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            <Tag size={12} />
                            <span>{task.category.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* ⭐ DETAIL KEGIATAN */}
          {activitiesByDate[selectedDate] &&
            activitiesByDate[selectedDate].length > 0 && (
              <div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                  📅 Kegiatan ({activitiesByDate[selectedDate].length})
                </p>
                <div className="space-y-2">
                  {activitiesByDate[selectedDate].map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        activity.is_completed
                          ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                          : "bg-orange-50 dark:bg-orange-900/20 border-orange-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h5
                          className={`font-semibold text-sm ${
                            activity.is_completed
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {activity.title}
                        </h5>
                        {activity.is_completed && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Selesai
                          </span>
                        )}
                      </div>

                      {activity.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {activity.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs">
                        {/* Waktu Mulai - Selesai */}
                        {activity.start_time && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Clock size={12} />
                            <span>
                              {formatTime(activity.start_time)}
                              {activity.end_time &&
                                ` - ${formatTime(activity.end_time)}`}
                            </span>
                          </div>
                        )}

                        {/* Lokasi */}
                        {activity.location && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin size={12} />
                            <span>{activity.location}</span>
                          </div>
                        )}

                        {/* Kategori */}
                        {activity.category && (
                          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                            <Tag size={12} />
                            <span>{activity.category.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Tidak Ada Data */}
          {(!tasksByDate[selectedDate] ||
            tasksByDate[selectedDate].length === 0) &&
            (!activitiesByDate[selectedDate] ||
              activitiesByDate[selectedDate].length === 0) && (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CalendarIcon
                    size={20}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Tidak ada tugas atau kegiatan
                </p>
              </div>
            )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Tugas</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Kegiatan</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">Hari Ini</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarCard;
