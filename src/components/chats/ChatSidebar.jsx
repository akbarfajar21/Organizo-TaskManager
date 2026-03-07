import {
  MoreVertical,
  Trash2,
  Search,
  Loader,
  CheckCheck,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ChatSidebar({
  search,
  setSearch,
  filteredUsers,
  recentChats,
  selectedUser,
  setSelectedUser,
  unreadCounts,
  openChatDropdown,
  setOpenChatDropdown,
  handleDeleteChat,
  isLoadingChats, // ✅ State loading untuk recent chats
  isLoadingSearch, // ✅ State loading untuk search
}) {
  const { user } = useAuth();
  return (
    <div className="w-full md:w-80 h-full border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900">
      {/* ✅ Header Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Pesan
        </h2>

        {/* ✅ Search Bar Modern */}
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Cari User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none focus:ring-2 focus:ring-yellow-400 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-sm placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* ✅ Hasil Pencarian */}
      {search.trim() !== "" && (
        <div className="border-b border-gray-200/80 dark:border-gray-700/50 max-h-60 overflow-y-auto bg-gradient-to-b from-gray-50/80 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm">
          {isLoadingSearch ? (
            <div className="p-6 text-center">
              <Loader
                size={24}
                className="text-yellow-500 animate-spin mx-auto mb-2"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Mencari user...
              </p>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-3.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 group"
                onClick={() => {
                  setSelectedUser(u);
                  setSearch("");
                }}
              >
                <div className="relative shrink-0">
                  <img
                    src={u.avatar_url || "/default-avatar.png"}
                    alt={u.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {u.full_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    ID: {u.user_id}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-200/50 dark:bg-gray-700/50 rounded-full mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                User ID "{search}" tidak ditemukan
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ Daftar Chat Terbaru */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {isLoadingChats ? (
          // ✅ Loading State - Tampilkan spinner saat loading
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Loader size={32} className="text-yellow-500 animate-spin mb-3" />
            <p className="text-gray-600 dark:text-gray-300 text-base font-semibold mb-1">
              Memuat percakapan...
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Tunggu sebentar
            </p>
          </div>
        ) : recentChats.length === 0 ? (
          // ✅ Empty State - Tampilkan jika tidak ada chat
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base font-semibold mb-1">
              Belum ada percakapan
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">
              Mulai chat dengan mencari User ID
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <Search
                size={16}
                className="text-yellow-600 dark:text-yellow-400"
              />
              <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Gunakan kotak pencarian di atas
              </span>
            </div>
          </div>
        ) : (
          // ✅ Daftar Chat
          recentChats.map((chat) => {
            const isSelected = selectedUser?.id === chat.id;
            const unreadCount = unreadCounts[chat.chat_id] || 0;

            return (
              <div
                key={chat.chat_id}
                className={`flex items-center gap-3 p-3 lg:p-4 cursor-pointer transition-colors relative group
                  ${
                    isSelected
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                onClick={() => setSelectedUser(chat)}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar_url || "/default-avatar.png"}
                    alt={chat.full_name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full border-2 border-yellow-400 pointer-events-none"></div>
                  )}
                </div>

                {/* Info Chat */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`font-semibold truncate text-sm transition-colors ${
                        isSelected
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    >
                      {chat.full_name}
                    </span>
                    {unreadCount > 0 && (
                      <span className="flex-shrink-0 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full ml-2">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {chat.last_message_sender === user?.id && (
                      <CheckCheck
                        size={14}
                        className={`shrink-0 ${chat.last_message_read ? "text-blue-500" : "text-gray-400"}`}
                      />
                    )}
                    <p
                      className={`text-xs truncate ${
                        unreadCount > 0
                          ? "font-semibold text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {chat.last_message_type !== "text" ? (
                        <span className="flex items-center gap-1 italic">
                          <FileText size={12} />
                          {chat.last_message_sender === user?.id
                            ? "Anda mengirim lampiran"
                            : "Mengirim lampiran"}
                        </span>
                      ) : (
                        <span>
                          {chat.last_message_sender === user?.id
                            ? "Anda: "
                            : ""}
                          {chat.last_message || "Belum ada pesan"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  data-dropdown="true"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenChatDropdown(
                        openChatDropdown === chat.chat_id ? null : chat.chat_id,
                      );
                    }}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </button>

                  {openChatDropdown === chat.chat_id && (
                    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-36 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.chat_id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Hapus Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
