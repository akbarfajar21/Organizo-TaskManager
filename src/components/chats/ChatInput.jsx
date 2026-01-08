// src/components/chats/ChatInput.jsx
import { Plus } from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  handleSendTask,
  selectedUser,
}) {
  if (!selectedUser) return null;

  return (
    <form
      className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <button
        type="button"
        onClick={handleSendTask}
        className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white"
        title="Kirim tugas/kegiatan"
      >
        <Plus size={20} />
      </button>
      <input
        type="text"
        className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder="Ketik pesan..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
      >
        Kirim
      </button>
    </form>
  );
}
