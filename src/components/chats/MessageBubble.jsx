// src/components/chats/MessageBubble.jsx
import {
  MoreVertical,
  Trash2,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  FolderOpen,
  CheckCircle2,
  Circle,
  CheckCheck,
} from "lucide-react";

export default function MessageBubble({
  msg,
  isOwnMessage,
  openDropdown,
  setOpenDropdown,
  handleDeleteMessage,
  formatTime,
}) {
  const renderTaskContent = (task) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
        <ClipboardList size={14} />
        <span>Tugas</span>
      </div>
      <div className="font-semibold text-[13px] text-gray-900 dark:text-gray-100 leading-tight">
        {task.tittle}
      </div>
      <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {task.description}
      </div>
      <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>
            Deadline:{" "}
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FolderOpen size={12} />
          <span>Kategori: {task.category_id || "-"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {task.is_done ? (
            <CheckCircle2 size={12} className="text-green-600" />
          ) : (
            <Circle size={12} className="text-gray-400" />
          )}
          <span>Status: {task.is_done ? "Selesai" : "Belum selesai"}</span>
        </div>
      </div>
    </div>
  );

  const renderActivityContent = (act) => {
    if (!act)
      return (
        <div className="text-[11px] text-red-500 dark:text-red-400">
          Error menampilkan kegiatan
        </div>
      );

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
          <Calendar size={14} />
          <span>Kegiatan</span>
        </div>
        <div className="font-semibold text-[13px] text-gray-900 dark:text-gray-100 leading-tight">
          {act.tittle}
        </div>
        <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {act.description}
        </div>
        <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>
              Tanggal:{" "}
              {act.activity_date
                ? new Date(act.activity_date).toLocaleDateString("id-ID")
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>
              Waktu: {act.start_time} - {act.end_time}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} />
            <span>Lokasi: {act.location || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderOpen size={12} />
            <span>Kategori: {act.category_id || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {act.is_completed ? (
              <CheckCircle2 size={12} className="text-green-600" />
            ) : (
              <Circle size={12} className="text-gray-400" />
            )}
            <span>
              Status: {act.is_completed ? "Selesai" : "Belum selesai"}
            </span>
          </div>
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
    <div
      className={`flex items-end gap-1 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`group max-w-[85%] sm:max-w-[75%] md:max-w-[65%]`}>
        {/* Bubble Pesan */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl flex flex-col
            ${
              isOwnMessage
                ? "bg-yellow-400 text-white rounded-tr-sm"
                : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm shadow-sm"
            }
          `}
        >
          {/* Baris atas: Dropdown & Konten */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {msg.type === "text" && (
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap mb-1">
                  {content}
                </p>
              )}
              {msg.type === "task" && renderTaskContent(content)}
              {msg.type === "activity" && renderActivityContent(content)}
            </div>
            {/* Dropdown menu (hanya untuk pesan sendiri) */}
            {isOwnMessage && (
              <div className="relative" data-dropdown="true">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === msg.id ? null : msg.id)
                  }
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-150"
                  type="button"
                  aria-label="Menu opsi pesan"
                >
                  <MoreVertical
                    size={14}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
                {openDropdown === msg.id && (
                  <div className="absolute right-0 top-7 bg-white dark:bg-gray-900 rounded-md shadow-md border border-gray-200 dark:border-gray-700 z-20 min-w-[130px]">
                    <button
                      onClick={() => {
                        handleDeleteMessage(msg.id);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150"
                      type="button"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Waktu kirim & Read Receipt */}
          <div
            className={`text-[10px] font-medium mt-1 select-none flex items-center gap-1 ${
              isOwnMessage
                ? "text-yellow-100 justify-end"
                : "text-gray-400 dark:text-gray-500 justify-end"
            }`}
          >
            {formatTime(msg.created_at)}
            {isOwnMessage && (
              <CheckCheck
                size={14}
                className={msg.is_read ? "text-blue-500" : "text-gray-400"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
