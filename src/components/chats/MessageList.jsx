// src/components/chats/MessageList.jsx
import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages,
  userId,
  openDropdown,
  setOpenDropdown,
  handleDeleteMessage,
  formatTime,
  messagesEndRef,
  dropdownRef,
}) {
  return (
    <div className="p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50 dark:bg-gray-900 min-h-full">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm font-medium">
              Belum ada pesan
            </p>
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
              Mulai percakapan sekarang!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOwnMessage={msg.sender_id === userId}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleDeleteMessage={handleDeleteMessage}
              formatTime={formatTime}
              dropdownRef={dropdownRef}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
