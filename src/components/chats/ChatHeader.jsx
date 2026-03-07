// src/components/chats/ChatHeader.jsx
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatHeader({
  selectedUser,
  onBack,
  onProfileClick,
  onClearChat,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-3 md:px-6 bg-white dark:bg-gray-900 w-full shadow-sm">
      {selectedUser ? (
        <>
          <div className="flex items-center gap-3 w-full">
            {/* Tombol Back untuk Mobile */}
            <button
              onClick={onBack}
              className="md:hidden p-2 -ml-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
              aria-label="Kembali"
            >
              <ArrowLeft
                size={20}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>

            {/* Clickable Area for Profile */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1.5 -ml-1.5 rounded-lg transition-colors flex-1 min-w-0"
              onClick={onProfileClick}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={selectedUser.avatar_url || "/default-avatar.png"}
                  alt={selectedUser.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                />
              </div>

              {/* Info User */}
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">
                  {selectedUser.full_name}
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-mono truncate">
                  ID: {selectedUser.user_id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: More Options Button */}
          <div
            className="flex items-center ml-auto shrink-0 relative"
            ref={dropdownRef}
          >
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
              aria-label="Opsi Lainnya"
            >
              <MoreVertical
                size={20}
                className="text-gray-600 dark:text-gray-400 group-hover:text-yellow-500"
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-[60]">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onClearChat();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                  Bersihkan Chat
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="text-center py-2">
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-semibold mb-1">
              Pilih pengguna untuk mulai chat
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Cari dan pilih user dari sidebar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
