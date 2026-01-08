import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useSidebar } from "../context/SidebarContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url;
  const fullName = profile?.full_name || "User";
  const initial = fullName?.charAt(0).toUpperCase() || "U";

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDayName = (date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[date.getDay()];
  };

  const getFormattedDate = (date) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getFormattedTime = (date) => {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <header
      className={`sticky top-0 z-40 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
        isCollapsed ? "ml-0" : "ml-0"
      }`}
    >
      {/* Left - Welcome Text */}
      <div className="flex-shrink-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Selamat datang,
        </p>
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px] sm:max-w-none">
          {fullName}
        </h2>
      </div>

      {/* Center - Clock & Date */}
      <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
            <Clock className="text-white" size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <Calendar size={12} />
              {getDayName(currentTime)}, {getFormattedDate(currentTime)}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums tracking-tight">
              {getFormattedTime(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Right - User Profile */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/app/settings")}
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[150px] group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            {fullName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
            {user?.email}
          </p>
        </div>
        <div
          title="Klik untuk ke Pengaturan"
          className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-gray-900 group-hover:ring-yellow-500 group-hover:scale-110 transition-all shadow-md ${
            avatarUrl
              ? "bg-transparent"
              : "bg-gradient-to-br from-yellow-400 to-amber-500"
          }`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-white text-lg">{initial}</span>
          )}
        </div>
      </div>
    </header>
  );
}
