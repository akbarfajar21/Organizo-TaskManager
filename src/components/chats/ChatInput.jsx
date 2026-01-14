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
      <div className="h-16 md:h-20 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gradient-to-t from-gray-50/95 to-transparent dark:from-gray-900/95 dark:to-transparent backdrop-blur-md shadow-inner">
        <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm select-none">
          Pilih chat untuk mengirim pesan
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 md:p-4 shadow-inner flex items-center gap-3">
      {/* Tombol Kirim Tugas/Kegiatan */}
      <button
        onClick={handleSendTask}
        className="p-2 md:p-2.5 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-full transition-colors duration-200 flex-shrink-0 shadow-sm"
        aria-label="Kirim tugas atau kegiatan"
        type="button"
      >
        <Paperclip size={20} className="text-yellow-500" />
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
        className="flex-1 resize-none rounded-3xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-200 px-4 py-2 md:py-2.5 text-sm md:text-base outline-none max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent"
        style={{ minHeight: "38px", maxHeight: "112px" }}
      />

      {/* Tombol Kirim */}
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="p-2 md:p-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-full transition-colors duration-200 flex-shrink-0 shadow-md disabled:cursor-not-allowed touch-manipulation"
        aria-label="Kirim pesan"
        type="button"
      >
        <Send
          size={20}
          className={input.trim() ? "text-gray-900" : "text-gray-500"}
        />
      </button>
    </div>
  );
}
