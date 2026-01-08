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

  // Fetch tasks & activities
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

  // Realtime subscription
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
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
        </button>
        <span className="font-bold text-base text-gray-800 dark:text-gray-100 capitalize">
          {currentDate.toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 flex items-center justify-center transition-colors"
        >
          <ChevronRight
            size={18}
            className="text-gray-600 dark:text-gray-300"
          />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <span
            key={d}
            className="font-bold text-gray-500 dark:text-gray-400 py-2"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
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
              className={`relative py-2 rounded-lg font-semibold transition-all
                ${
                  isToday
                    ? "border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-white dark:bg-gray-900 z-10"
                    : isSelected
                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 ring-2 ring-yellow-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {day}
              {/* Titik indikator tugas & kegiatan */}
              <div className="absolute bottom-1 left-1/2 flex gap-0.5 -translate-x-1/2">
                {dayTasks.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                )}
                {dayActivities.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            {new Date(selectedDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
            })}
          </p>

          {/* Tugas */}
          <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
            Tugas
          </p>
          {(tasksByDate[selectedDate] || []).length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
              Tidak ada tugas
            </p>
          ) : (
            <ul className="space-y-2 mb-2">
              {tasksByDate[selectedDate].map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                >
                  <span className="text-yellow-500 mt-1">•</span>
                  <span
                    className={
                      t.is_done
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-300 font-medium"
                    }
                  >
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Kegiatan */}
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            Kegiatan
          </p>
          {(activitiesByDate[selectedDate] || []).length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Tidak ada kegiatan
            </p>
          ) : (
            <ul className="space-y-2">
              {activitiesByDate[selectedDate].map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <span className="text-purple-500 mt-1">•</span>
                  <span
                    className={
                      a.is_completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-300 font-medium"
                    }
                  >
                    {a.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
};

export default CalendarCard;
