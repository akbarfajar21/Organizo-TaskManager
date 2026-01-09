import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
        .select("id,title,due_date,is_done")
        .eq("user_id", user.id)
        .gte("due_date", start)
        .lte("due_date", end),
      supabase
        .from("activities")
        .select("id,title,activity_date,is_completed")
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

  return (
    <Card title={title} icon={Clock}>
      {/* Calendar Header - Responsive */}
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

      {/* Day Names - Responsive */}
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

      {/* Calendar Grid - Responsive */}
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
              {/* Indicator Dots - Responsive */}
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

      {/* Selected Date Details - Responsive */}
      {selectedDate && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
            {new Date(selectedDate).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h4>

          {/* Tasks for Selected Date */}
          {tasksByDate[selectedDate] &&
            tasksByDate[selectedDate].length > 0 && (
              <div className="mb-2 sm:mb-3">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 sm:mb-2">
                  Tugas ({tasksByDate[selectedDate].length})
                </p>
                <ul className="space-y-1 sm:space-y-1.5">
                  {tasksByDate[selectedDate].map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                          task.is_done ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <span
                        className={`truncate ${
                          task.is_done
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {task.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Activities for Selected Date */}
          {activitiesByDate[selectedDate] &&
            activitiesByDate[selectedDate].length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1 sm:mb-2">
                  Kegiatan ({activitiesByDate[selectedDate].length})
                </p>
                <ul className="space-y-1 sm:space-y-1.5">
                  {activitiesByDate[selectedDate].map((activity) => (
                    <li
                      key={activity.id}
                      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                          activity.is_completed
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <span
                        className={`truncate ${
                          activity.is_completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {activity.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* No Tasks or Activities */}
          {(!tasksByDate[selectedDate] ||
            tasksByDate[selectedDate].length === 0) &&
            (!activitiesByDate[selectedDate] ||
              activitiesByDate[selectedDate].length === 0) && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                Tidak ada tugas atau kegiatan
              </p>
            )}
        </div>
      )}

      {/* Legend - Responsive */}
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
