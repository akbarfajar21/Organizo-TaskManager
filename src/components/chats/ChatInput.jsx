// src/components/chats/ChatInput.jsx
import { Send, Paperclip } from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  handleSendTask,
  selectedUser,
}) {
  if (!selectedUser) {
    return (
      <div className="h-16 md:h-20 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm">
          Pilih chat untuk mengirim pesan
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-3 md:p-4 shadow-sm">
      <div className="flex items-end gap-2">
        {/* Tombol Kirim Tugas/Kegiatan */}
        <button
          onClick={handleSendTask}
          className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
          aria-label="Kirim tugas atau kegiatan"
        >
          <Paperclip size={20} className="text-gray-600 dark:text-gray-400" />
        </button>

        {/* Input Pesan */}
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ketik pesan..."
            rows={1}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all outline-none resize-none text-sm md:text-base max-h-32 overflow-y-auto"
            style={{
              minHeight: "40px",
              maxHeight: "128px",
            }}
          />
        </div>

        {/* Tombol Kirim */}
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim()}
          className="p-2 md:p-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-full transition-colors flex-shrink-0 disabled:cursor-not-allowed"
          aria-label="Kirim pesan"
        >
          <Send
            size={20}
            className={input.trim() ? "text-gray-900" : "text-gray-500"}
          />
        </button>
      </div>
    </div>
  );
}
