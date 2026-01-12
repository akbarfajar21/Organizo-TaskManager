// src/components/chats/ChatHeader.jsx
import { ArrowLeft, MoreVertical } from "lucide-react";

export default function ChatHeader({ selectedUser, onBack }) {
  return (
    <div className="h-16 md:h-[72px] border-b border-gray-200/80 dark:border-gray-700/50 flex items-center px-4 md:px-6 bg-gradient-to-r from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50 backdrop-blur-md shadow-sm">
      {selectedUser ? (
        <div className="flex items-center justify-between w-full">
          {/* Left Section: Back Button + User Info */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Tombol Back untuk Mobile */}
            <button
              onClick={onBack}
              className="md:hidden mr-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 flex-shrink-0 active:scale-95"
              aria-label="Kembali"
            >
              <ArrowLeft
                size={20}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>

            {/* Avatar with Status Ring */}
            <div className="relative flex-shrink-0">
              <img
                src={selectedUser.avatar_url || "/default-avatar.png"}
                alt={selectedUser.full_name}
                className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover ring-[3px] ring-yellow-400/60 dark:ring-yellow-500/60 shadow-md"
              />
              {/* Decorative Gradient Border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Info User */}
            <div className="flex flex-col min-w-0 flex-1 ml-3 md:ml-4">
              <span className="font-bold text-base md:text-lg text-gray-900 dark:text-gray-100 truncate leading-tight">
                {selectedUser.full_name}
              </span>
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5 select-text">
                ID: {selectedUser.user_id}
              </span>
            </div>
          </div>

          {/* Right Section: More Options Button */}
          <div className="flex items-center ml-2 flex-shrink-0">
            <button
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group active:scale-95"
              aria-label="Opsi Lainnya"
            >
              <MoreVertical
                size={20}
                className="text-gray-600 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors"
              />
            </button>
          </div>
        </div>
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
