// src/components/chats/MessageBubble.jsx
import { MoreVertical, Trash2 } from "lucide-react";

export default function MessageBubble({
  msg,
  isOwnMessage,
  openDropdown,
  setOpenDropdown,
  handleDeleteMessage,
  formatTime,
  dropdownRef,
}) {
  const renderTaskContent = (task) => (
    <div>
      <b>Tugas:</b>
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {task.tittle}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-900">
        {task.description}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-900">
        Deadline:{" "}
        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-900">
        Kategori: {task.category_id || "-"}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-900">
        Status: {task.is_done ? "Selesai" : "Belum selesai"}
      </div>
    </div>
  );

  const renderActivityContent = (act) => {
    if (!act)
      return (
        <div className="text-gray-600 dark:text-gray-300">
          Error menampilkan kegiatan
        </div>
      );

    return (
      <div>
        <b>Kegiatan:</b>
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {act.tittle}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-900">
          {act.description}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-900">
          Tanggal:{" "}
          {act.activity_date
            ? new Date(act.activity_date).toLocaleDateString()
            : "-"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-900">
          Waktu: {act.start_time} - {act.end_time}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-900">
          Lokasi: {act.location}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-900">
          Kategori: {act.category_id || "-"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-900">
          Status: {act.is_completed ? "Selesai" : "Belum selesai"}
        </div>
      </div>
    );
  };

  const parseContent = (content, type) => {
    if (type === "text") return content;

    try {
      return typeof content === "string" ? JSON.parse(content) : content;
    } catch (e) {
      console.warn("JSON parse error:", e);
      return type === "task" ? {} : null;
    }
  };

  const content = parseContent(msg.content, msg.type);

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg relative ${
          isOwnMessage
            ? "bg-yellow-400 text-gray-900"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        {/* Dropdown menu (hanya untuk pesan sendiri) */}
        {isOwnMessage && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === msg.id ? null : msg.id)
              }
              className="text-white hover:bg-yellow-500 rounded p-1"
              type="button"
            >
              <MoreVertical size={16} />
            </button>

            {openDropdown === msg.id && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[120px]"
              >
                <button
                  onClick={() => {
                    handleDeleteMessage(msg.id);
                    setOpenDropdown(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  type="button"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            )}
          </div>
        )}

        {/* Konten pesan */}
        <div className={isOwnMessage ? "pr-6" : ""}>
          {msg.type === "text" && (
            <div className="text-gray-900 dark:text-gray-100">{content}</div>
          )}

          {msg.type === "task" && renderTaskContent(content)}
          {msg.type === "activity" && renderActivityContent(content)}

          {/* Waktu kirim */}
          <div className="text-xs text-gray-600 dark:text-gray-900 mt-1 text-right">
            {formatTime(msg.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
