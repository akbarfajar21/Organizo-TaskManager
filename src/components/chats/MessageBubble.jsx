// src/components/chats/MessageBubble.jsx
import {
  MoreVertical,
  Trash2,
  ClipboardList, // Icon untuk Tugas
  Calendar, // Icon untuk Kegiatan
  Clock, // Icon untuk Waktu/Deadline
  MapPin, // Icon untuk Lokasi
  FolderOpen, // Icon untuk Kategori
  CheckCircle2, // Icon untuk Status Selesai
  Circle, // Icon untuk Status Belum Selesai
} from "lucide-react";

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
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-gray-800 dark:text-gray-900 mb-1.5">
        <ClipboardList size={14} className="flex-shrink-0" />
        <span>Tugas</span>
      </div>
      <div className="font-semibold text-[13px] md:text-sm text-gray-900 dark:text-gray-100">
        {task.tittle}
      </div>
      <div className="text-[11px] md:text-xs text-gray-700 dark:text-gray-900 leading-relaxed">
        {task.description}
      </div>
      <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-900 mt-1 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="flex-shrink-0" />
          <span>
            Deadline:{" "}
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FolderOpen size={12} className="flex-shrink-0" />
          <span>Kategori: {task.category_id || "-"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {task.is_done ? (
            <CheckCircle2 size={12} className="flex-shrink-0 text-green-600" />
          ) : (
            <Circle size={12} className="flex-shrink-0 text-gray-400" />
          )}
          <span>Status: {task.is_done ? "Selesai" : "Belum selesai"}</span>
        </div>
      </div>
    </div>
  );

  const renderActivityContent = (act) => {
    if (!act)
      return (
        <div className="text-[11px] md:text-xs text-gray-600 dark:text-gray-300">
          Error menampilkan kegiatan
        </div>
      );

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-gray-800 dark:text-gray-900 mb-1.5">
          <Calendar size={14} className="flex-shrink-0" />
          <span>Kegiatan</span>
        </div>
        <div className="font-semibold text-[13px] md:text-sm text-gray-900 dark:text-gray-100">
          {act.tittle}
        </div>
        <div className="text-[11px] md:text-xs text-gray-700 dark:text-gray-900 leading-relaxed">
          {act.description}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-900 mt-1 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="flex-shrink-0" />
            <span>
              Tanggal:{" "}
              {act.activity_date
                ? new Date(act.activity_date).toLocaleDateString("id-ID")
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="flex-shrink-0" />
            <span>
              Waktu: {act.start_time} - {act.end_time}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="flex-shrink-0" />
            <span>Lokasi: {act.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderOpen size={12} className="flex-shrink-0" />
            <span>Kategori: {act.category_id || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {act.is_completed ? (
              <CheckCircle2
                size={12}
                className="flex-shrink-0 text-green-600"
              />
            ) : (
              <Circle size={12} className="flex-shrink-0 text-gray-400" />
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
      <div
        className={`
          relative group 
          max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]
        `}
      >
        {/* Bubble Pesan */}
        <div
          className={`
            relative px-2.5 py-2 md:px-3 md:py-2.5 rounded-lg shadow-sm
            ${
              isOwnMessage
                ? "bg-yellow-400 text-gray-900 rounded-br-none"
                : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
            }
          `}
        >
          {/* Dropdown menu (hanya untuk pesan sendiri) */}
          {isOwnMessage && (
            <div className="absolute -right-6 md:-right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === msg.id ? null : msg.id)
                }
                className="p-1 md:p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                type="button"
              >
                <MoreVertical
                  size={14}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>

              {openDropdown === msg.id && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-6 md:top-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 min-w-[120px] md:min-w-[140px]"
                >
                  <button
                    onClick={() => {
                      handleDeleteMessage(msg.id);
                      setOpenDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs md:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    type="button"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Konten pesan */}
          <div className="break-words">
            {msg.type === "text" && (
              <p className="text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap pr-12">
                {content}
              </p>
            )}

            {msg.type === "task" && renderTaskContent(content)}
            {msg.type === "activity" && renderActivityContent(content)}

            {/* Waktu kirim (pojok kanan bawah) */}
            <div className="absolute bottom-1 right-2 text-[10px] md:text-[11px] text-gray-700 dark:text-gray-400 font-medium">
              {formatTime(msg.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
