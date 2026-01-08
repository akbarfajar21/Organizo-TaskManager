// src/components/chats/ChatSidebar.jsx
import { MoreVertical, Trash2 } from "lucide-react";

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
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col relative">
      <input
        type="text"
        placeholder="Cari berdasarkan User ID..." // ✅ Update placeholder
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />

      {/* Hasil pencarian */}
      {/* Hasil pencarian - Tampilkan saat ada input search */}
      {search.trim() !== "" && (
        <div className="absolute top-14 left-4 right-4 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md z-50">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                onClick={() => {
                  setSelectedUser(u);
                  setSearch("");
                }}
              >
                <img
                  src={u.avatar_url || "/default-avatar.png"}
                  alt={u.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {u.full_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    ID: {u.user_id}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              User ID "{search}" tidak ditemukan
            </div>
          )}
        </div>
      )}

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Chat Terakhir
        </div>

        {recentChats.length === 0 && (
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Belum ada chat
          </div>
        )}

        {recentChats.map((u) => {
          const hasUnread = unreadCounts[u.chat_id] > 0;

          return (
            <div
              key={u.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 relative ${
                selectedUser?.id === u.id
                  ? "bg-yellow-200 dark:bg-yellow-800/40"
                  : ""
              }`}
            >
              {/* Avatar dan nama user */}
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => setSelectedUser(u)}
              >
                <img
                  src={u.avatar_url || "/default-avatar.png"}
                  alt={u.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className={`font-medium text-gray-900 dark:text-gray-100 ${
                      hasUnread ? "font-bold" : ""
                    }`}
                  >
                    {u.full_name}
                  </span>

                  {hasUnread && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] flex items-center justify-center">
                      {unreadCounts[u.chat_id]}
                    </span>
                  )}
                </div>
              </div>

              {/* Tombol titik 3 untuk hapus chat */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenChatDropdown(
                      openChatDropdown === u.chat_id ? null : u.chat_id
                    );
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded"
                  type="button"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown menu hapus chat */}
                {openChatDropdown === u.chat_id && (
                  <div
                    ref={chatDropdownRef}
                    className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[140px]"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(u.chat_id);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      type="button"
                    >
                      <Trash2 size={16} />
                      Hapus Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
