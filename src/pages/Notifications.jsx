import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  CheckCheck,
} from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  /* ================= REALTIME SUBSCRIPTION ================= */
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          fetchNotifications();

          // Cek jika event adalah INSERT (notifikasi baru)
          if (payload.eventType === "INSERT") {
            const notif = payload.new;
            // Tampilkan notifikasi push jika user sudah izinkan
            if (
              Notification.permission === "granted" &&
              navigator.serviceWorker
            ) {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(notif.title, {
                  body: notif.message,
                  icon: "/logo.png", // pastikan file ada di public/
                  tag: `notif-${notif.id}`,
                  data: { url: "/app/notifications" }, // bisa diarahkan ke halaman notif
                });
              });
            }
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  /* ================= ICON & COLOR BY TYPE ================= */
  const getNotificationStyle = (type) => {
    switch (type) {
      case "deadline":
        return {
          icon: Clock,
          iconColor: "text-yellow-600 dark:text-yellow-400",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
          borderColor: "border-yellow-400 dark:border-yellow-500",
        };
      case "overdue":
        return {
          icon: AlertCircle,
          iconColor: "text-red-600 dark:text-red-400",
          iconBg: "bg-red-100 dark:bg-red-900/40",
          borderColor: "border-red-400 dark:border-red-500",
        };
      case "completed":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600 dark:text-green-400",
          iconBg: "bg-green-100 dark:bg-green-900/40",
          borderColor: "border-green-400 dark:border-green-500",
        };
      default:
        return {
          icon: Bell,
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-900/40",
          borderColor: "border-blue-400 dark:border-blue-500",
        };
    }
  };

  /* ================= MARK AS READ ================= */
  const markAsRead = async (notifId) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);

    if (!error) {
      fetchNotifications();
    }
  };

  /* ================= MARK ALL AS READ ================= */
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);

    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (!error) {
      fetchNotifications();
    }
  };

  /* ================= DELETE NOTIFICATION ================= */
  const deleteNotification = async (notifId) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notifId);

    if (!error) {
      fetchNotifications();
    }
  };

  /* ================= DELETE ALL READ ================= */
  const deleteAllRead = async () => {
    const readIds = notifications.filter((n) => n.is_read).map((n) => n.id);

    if (readIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .in("id", readIds);

    if (!error) {
      fetchNotifications();
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return !n.is_read;
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount = notifications.filter((n) => n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Memuat notifikasi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                <Bell className="text-white" size={16} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
                Notifikasi
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-10 sm:ml-13 truncate">
              {unreadCount > 0
                ? `${unreadCount} notifikasi belum dibaca`
                : "Semua notifikasi sudah dibaca"}
            </p>
          </div>

          {/* Actions - Responsive */}
          <div className="flex gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-all hover:shadow-sm"
              >
                <CheckCheck size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Tandai Semua</span>
                <span className="sm:hidden">Tandai</span>
              </button>
            )}
            {readCount > 0 && (
              <button
                onClick={deleteAllRead}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700 rounded-lg font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Hapus Terbaca</span>
                <span className="sm:hidden">Hapus</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs - Responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 flex gap-1 sm:gap-1.5">
          <FilterTab
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Belum Dibaca"
            count={unreadCount}
          />
          <FilterTab
            active={filter === "read"}
            onClick={() => setFilter("read")}
            label="Sudah Dibaca"
            count={readCount}
          />
        </div>

        {/* Notifications List - Responsive */}
        <div className="space-y-2 sm:space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Bell
                  size={24}
                  className="sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                {filter === "all"
                  ? "Tidak ada notifikasi belum dibaca"
                  : "Tidak ada notifikasi yang sudah dibaca"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Notifikasi akan muncul di sini saat ada update
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getStyle={getNotificationStyle}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterTab({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all ${
        active
          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <span className="truncate">{label}</span>
      {count > 0 && (
        <span
          className={`ml-1 sm:ml-2 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
            active
              ? "bg-white/30"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function NotificationCard({ notification, onMarkAsRead, onDelete, getStyle }) {
  const style = getStyle(notification.type);
  const Icon = style.icon;

  return (
    <div
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
      className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md border-l-4 hover:shadow-lg transition-all cursor-pointer group ${
        notification.is_read
          ? "border-gray-300 dark:border-gray-600 opacity-75"
          : `${style.borderColor}`
      }`}
    >
      <div className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
        {/* Icon - Responsive */}
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
        >
          <Icon className={style.iconColor} size={14} />
        </div>

        {/* Content - Responsive */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1">
            <h3
              className={`font-bold text-xs sm:text-sm break-words ${
                notification.is_read
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {notification.title}
            </h3>
            {!notification.is_read && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-1 animate-pulse"></span>
            )}
          </div>

          {notification.message && (
            <p
              className={`text-[10px] sm:text-xs mb-1.5 sm:mb-2 break-words ${
                notification.is_read
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {notification.message}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 flex-shrink-0">
              <Clock size={8} className="sm:w-2.5 sm:h-2.5" />
              <span className="truncate">
                {new Date(notification.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 sm:p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
              title="Hapus notifikasi"
            >
              <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
