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
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
    </div>
  );
}
