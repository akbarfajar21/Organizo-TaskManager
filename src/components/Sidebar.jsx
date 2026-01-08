import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  Settings,
  LogOut,
  Tag,
  Sun,
  Moon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import { useChat } from "../context/ChatContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [taskCount, setTaskCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const { totalUnreadMessages } = useChat();

  /* ================= FETCH FUNCTIONS ================= */
  const fetchTaskCount = async () => {
    if (!user?.id) return;
    const { count, error } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_done", false);
    if (!error) setTaskCount(count || 0);
  };

  const fetchNotificationCount = async () => {
    if (!user?.id) return;
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    if (!error) setNotificationCount(count || 0);
  };

  const fetchActivityCount = async () => {
    if (!user?.id) return;
    const today = new Date().toISOString().slice(0, 10);
    const { count, error } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("activity_date", today);
    if (!error) setActivityCount(count || 0);
  };

  useEffect(() => {
    fetchTaskCount();
    fetchNotificationCount();
    fetchActivityCount();
  }, [user?.id]);

  /* ================= REALTIME SUBSCRIPTIONS ================= */
  useEffect(() => {
    if (!user?.id) return;
    const channelTasks = supabase
      .channel(`sidebar-tasks-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        fetchTaskCount
      )
      .subscribe();
    const channelNotifications = supabase
      .channel(`sidebar-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        fetchNotificationCount
      )
      .subscribe();
    const channelActivities = supabase
      .channel(`sidebar-activities-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `user_id=eq.${user.id}`,
        },
        fetchActivityCount
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelTasks);
      supabase.removeChannel(channelNotifications);
      supabase.removeChannel(channelActivities);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="h-screen bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-700 sticky top-0 shadow-sm transition-all duration-300 ease-in-out relative"
      style={{
        width: isCollapsed ? 80 : 280,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* TOGGLE BUTTON - PINGGIR SIDEBAR */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-400 dark:hover:bg-yellow-500 dark:hover:border-yellow-500 transition-all duration-200 hover:scale-110 shadow-md z-50"
      >
        {isCollapsed ? (
          <ChevronRight
            size={14}
            className="text-gray-600 dark:text-gray-400"
          />
        ) : (
          <ChevronLeft size={14} className="text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* TOP - LOGO */}
      <div className="flex-shrink-0 px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <div
          className="cursor-pointer group flex items-center justify-center"
          onClick={() => navigate("/app")}
        >
          <div
            className={`${
              isCollapsed ? "w-11 h-11" : "w-10 h-10"
            } rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
          >
            <img
              src="/logo.png"
              alt="Organizo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {!isCollapsed && (
          <div className="text-center mt-3">
            <h1
              className="text-lg font-bold text-gray-800 dark:text-gray-100 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer"
              onClick={() => navigate("/app")}
            >
              Organizo
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Task Manager
            </p>
          </div>
        )}
      </div>

      {/* MIDDLE - MENU */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <nav
          className={`space-y-2 ${
            isCollapsed ? "flex flex-col items-center" : ""
          }`}
        >
          <SidebarItem
            to="/app"
            label="Dashboard"
            icon={LayoutDashboard}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/app/tasks"
            label="Tugas Saya"
            icon={CheckSquare}
            badge={taskCount}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/app/activities"
            label="Kegiatan"
            icon={Calendar}
            badge={activityCount}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/app/chat"
            label="Chat"
            icon={MessageCircle}
            badge={totalUnreadMessages}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/app/notifications"
            label="Notifikasi"
            icon={Bell}
            badge={notificationCount}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/app/categories"
            label="Kategori"
            icon={Tag}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/app/help"
            label="Bantuan"
            icon={HelpCircle}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      {/* BOTTOM - SETTINGS & LOGOUT */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div
          className={`px-3 py-3 space-y-2 ${
            isCollapsed ? "flex flex-col items-center" : ""
          }`}
        >
          <SidebarItem
            to="/app/settings"
            label="Pengaturan"
            icon={Settings}
            isCollapsed={isCollapsed}
          />
          <button
            onClick={toggleTheme}
            className={`${
              isCollapsed ? "w-12 h-12" : "w-full"
            } flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            } px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            {!isCollapsed && (
              <span>{theme === "light" ? "Mode Gelap" : "Mode Terang"}</span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`${
              isCollapsed ? "w-12 h-12" : "w-full"
            } flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            } px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-105`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ===== SIDEBAR ITEM ===== */
function SidebarItem({ to, label, icon: Icon, badge, isCollapsed }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center ${
          isCollapsed ? "justify-center w-12 h-12" : "justify-between"
        } px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group relative ${
          isActive
            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md scale-105"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <Icon
              size={20}
              className={
                isActive
                  ? ""
                  : "group-hover:scale-110 transition-transform duration-200"
              }
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300">{label}</span>
            )}
          </div>
          {badge > 0 && !isCollapsed && (
            <span className="min-w-[22px] h-[22px] px-1.5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white font-bold shadow-sm animate-pulse">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
          {badge > 0 && isCollapsed && (
            <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white font-bold animate-pulse shadow-md">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
