// src/components/chats/ChatHeader.jsx
export default function ChatHeader({ selectedUser }) {
  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 bg-white dark:bg-gray-900">
      {selectedUser ? (
        <>
          <img
            src={selectedUser.avatar_url || "/default-avatar.png"}
            alt={selectedUser.full_name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            {selectedUser.full_name}
          </span>
        </>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">
          Pilih pengguna untuk mulai chat
        </span>
      )}
    </div>
  );
}
