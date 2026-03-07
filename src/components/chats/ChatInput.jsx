// src/components/chats/ChatInput.jsx
import { useRef } from "react";
import { Send, Paperclip } from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  handleSendTask,
  selectedUser,
}) {
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage();
    // Fokuskan kembali textarea agar keyboard tetap muncul di mobile
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-16 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <p className="text-gray-500 text-sm select-none">
          Pilih chat untuk mengirim pesan
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 flex items-end gap-2 w-full">
      {/* Tombol Kirim Tugas/Kegiatan */}
      <button
        onClick={handleSendTask}
        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0 mb-0.5"
        aria-label="Kirim tugas atau kegiatan"
        type="button"
      >
        <Paperclip
          size={20}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        />
      </button>

      {/* Input Pesan */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
              handleSend();
            }
          }
        }}
        placeholder="Ketik pesan..."
        rows={1}
        className="flex-1 resize-none rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none focus:ring-2 focus:ring-yellow-400 dark:focus:bg-gray-800 transition-all outline-none px-4 py-2.5 text-sm md:text-base max-h-32 overflow-y-auto"
        style={{ minHeight: "44px" }}
      />

      {/* Tombol Kirim */}
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="p-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-lg transition-colors shrink-0 mb-0.5 disabled:cursor-not-allowed"
        aria-label="Kirim pesan"
        type="button"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
