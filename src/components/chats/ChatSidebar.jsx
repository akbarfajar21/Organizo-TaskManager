import { MoreVertical, Trash2, Search, Loader } from "lucide-react";

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
  isLoadingChats, // ✅ State loading untuk recent chats
  isLoadingSearch, // ✅ State loading untuk search
}) {
  return (
    <div className="w-full md:w-80 border-r border-gray-200/80 dark:border-gray-700/50 flex flex-col bg-gradient-to-b from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-900/95 backdrop-blur-sm">
      {/* ✅ Header Sidebar */}
      <div className="p-5 border-b border-gray-200/80 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
          Pesan
        </h2>

        {/* ✅ Search Bar Modern */}
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Cari User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 outline-none text-sm placeholder:text-gray-400 shadow-sm"
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
                className="flex items-center gap-3.5 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 dark:hover:from-yellow-900/20 dark:hover:to-yellow-900/10 transition-all duration-200 border-b border-gray-100/80 dark:border-gray-700/30 group"
                onClick={() => {
                  setSelectedUser(u);
                  setSearch("");
                }}
              >
                <div className="relative">
                  <img
                    src={u.avatar_url || "/default-avatar.png"}
                    alt={u.full_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200/80 dark:ring-gray-700/80 group-hover:ring-yellow-400/50 transition-all duration-200 shadow-sm"
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
                className={`
                  flex items-center gap-3.5 p-4 cursor-pointer transition-all duration-200 relative group
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-900/20 border-l-[3px] border-yellow-500 shadow-sm"
                      : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/30 dark:hover:from-gray-800/50 dark:hover:to-gray-800/30 border-l-[3px] border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
                onClick={() => setSelectedUser(chat)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar_url || "/default-avatar.png"}
                    alt={chat.full_name}
                    className={`w-13 h-13 rounded-full object-cover ring-2 transition-all duration-200 shadow-md ${
                      isSelected
                        ? "ring-yellow-400/60 dark:ring-yellow-500/60"
                        : "ring-gray-200/80 dark:ring-gray-700/80 group-hover:ring-gray-300 dark:group-hover:ring-gray-600"
                    }`}
                  />
                </div>

                {/* Info Chat */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-semibold truncate text-sm transition-colors ${
                        isSelected
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                      }`}
                    >
                      {chat.full_name}
                    </span>
                    {unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[22px] h-[22px] px-2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Tap untuk membuka chat
                  </p>
                </div>

                <div className="relative flex-shrink-0" ref={chatDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenChatDropdown(
                        openChatDropdown === chat.chat_id ? null : chat.chat_id,
                      );
                    }}
                    className="p-2 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  </button>

                  {openChatDropdown === chat.chat_id && (
                    <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl shadow-xl z-10 min-w-[170px] overflow-hidden backdrop-blur-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.chat_id);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
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
