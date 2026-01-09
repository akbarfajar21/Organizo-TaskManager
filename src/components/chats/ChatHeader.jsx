// src/components/chats/ChatHeader.jsx
import { ArrowLeft } from "lucide-react";

export default function ChatHeader({ selectedUser, onBack }) {
  return (
    <div className="h-14 md:h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-3 md:px-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
      {selectedUser ? (
        <div className="flex items-center w-full">
          {/* Tombol Back untuk Mobile */}
          <button
            onClick={onBack}
            className="md:hidden mr-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Avatar */}
          <img
            src={selectedUser.avatar_url || "/default-avatar.png"}
            alt={selectedUser.full_name}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover mr-2 md:mr-3 ring-2 ring-yellow-400 flex-shrink-0"
          />

          {/* Info User */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">
              {selectedUser.full_name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Online
            </span>
          </div>
        </div>
      ) : (
        <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
          Pilih pengguna untuk mulai chat
        </span>
      )}
    </div>
  );
}
