import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, Menu, X } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Header() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();

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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getFormattedTime = (date) => {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Mobile Menu Button - Tampil hanya di mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <Menu size={20} className="text-white" />
        )}
      </button>

      {/* Left - Welcome Text */}
      <div className="flex-shrink-0">
        {/* Mobile - Show welcome text with full name */}
        <div className="lg:hidden">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Selamat datang,
          </p>
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px]">
            {fullName}
          </h2>
        </div>
        {/* Desktop - Show welcome text with full name */}
        <div className="hidden lg:block">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Selamat datang,
          </p>
          <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[200px]">
            {fullName}
          </h2>
        </div>
      </div>

      {/* Center - Clock & Date (Hidden on mobile & tablet, shown on desktop) */}
      <div className="hidden xl:flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
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
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        onClick={() => navigate("/app/settings")}
      >
        <div className="text-right hidden lg:block">
          {/* Name & Status */}
          <div className="flex items-center justify-end gap-1.5 mb-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[100px] xl:max-w-[130px] group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
              {fullName}
            </p>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          </div>

          {/* Email & ID */}
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] xl:max-w-[150px]">
              {user?.email}
            </p>
            <div className="flex items-center justify-end">
              <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                ID: {user?.id?.slice(0, 6)}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar with Badge */}
        <div className="relative">
          <div
            title={`${fullName}\n${user?.email}\nID: ${user?.id}`}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-gray-900 group-hover:ring-yellow-500 group-hover:scale-110 transition-all shadow-md ${
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
              <span className="font-bold text-white text-base sm:text-lg">
                {initial}
              </span>
            )}
          </div>
          {/* Online Badge */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
        </div>
      </div>
    </header>
  );
}
