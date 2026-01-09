// src/components/chats/ChatSidebar.jsx
import { MoreVertical, Trash2, Search } from "lucide-react";

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
  chatDropdownRef,
}) {
  return (
    <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900">
      {/* ✅ Header Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Pesan
        </h2>

        {/* ✅ Search Bar Modern */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* ✅ Hasil Pencarian */}
      {search.trim() !== "" && (
        <div className="border-b border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors border-b border-gray-100 dark:border-gray-700/50"
                onClick={() => {
                  setSelectedUser(u);
                  setSearch("");
                }}
              >
                <img
                  src={u.avatar_url || "/default-avatar.png"}
                  alt={u.full_name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {u.full_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    ID: {u.user_id}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              User ID "{search}" tidak ditemukan
            </div>
          )}
        </div>
      )}

      {/* ✅ Daftar Chat Terbaru */}
      <div className="flex-1 overflow-y-auto">
        {recentChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <Search size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Belum ada percakapan
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Cari user untuk memulai chat
            </p>
          </div>
        ) : (
          recentChats.map((chat) => {
            const isSelected = selectedUser?.id === chat.id;
            const unreadCount = unreadCounts[chat.chat_id] || 0;

            return (
              <div
                key={chat.chat_id}
                className={`
                  flex items-center gap-3 p-3 cursor-pointer transition-all relative
                  ${
                    isSelected
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-transparent"
                  }
                `}
                onClick={() => setSelectedUser(chat)}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={chat.avatar_url || "/default-avatar.png"}
                    alt={chat.full_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  {/* Online Indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>

                {/* Info Chat */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                      {chat.full_name}
                    </span>
                    {unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-yellow-400 text-white text-xs font-bold rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Tap untuk membuka chat
                  </p>
                </div>

                {/* Dropdown Menu */}
                <div className="relative" ref={chatDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenChatDropdown(
                        openChatDropdown === chat.chat_id ? null : chat.chat_id
                      );
                    }}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <MoreVertical
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  </button>

                  {openChatDropdown === chat.chat_id && (
                    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[160px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.chat_id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
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
