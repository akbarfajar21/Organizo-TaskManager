import { CheckCircle2, Calendar, Clock, MapPin, Tag } from "lucide-react";

export default function HistoryItem({ item, onClick, formatDate, formatTime }) {
  const isCompleted =
    (item.type === "task" && item.is_done) ||
    (item.type === "activity" && item.is_completed);

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-lg ${
        item.type === "task"
          ? item.is_done
            ? "border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10"
            : "border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
          : item.is_completed
            ? "border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10"
            : "border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                item.type === "task"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              }`}
            >
              {item.type === "task" ? "Tugas" : "Kegiatan"}
            </span>
            {isCompleted && (
              <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} />
                Selesai
              </span>
            )}
          </div>
          <h3
            className={`text-base sm:text-lg font-bold mb-2 ${
              isCompleted
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {item.type === "task" && item.due_date && (
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg">
            <Calendar size={12} />
            <span>{formatDate(item.due_date)}</span>
          </div>
        )}
        {item.type === "activity" && item.activity_date && (
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg">
            <Calendar size={12} />
            <span>{formatDate(item.activity_date)}</span>
          </div>
        )}

        {item.type === "task" && item.due_time && (
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1.5 rounded-lg">
            <Clock size={12} />
            <span>{formatTime(item.due_time)}</span>
          </div>
        )}
        {item.type === "activity" && item.start_time && (
          <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1.5 rounded-lg">
            <Clock size={12} />
            <span>
              {formatTime(item.start_time)}
              {item.end_time && ` - ${formatTime(item.end_time)}`}
            </span>
          </div>
        )}

        {item.type === "activity" && item.location && (
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1.5 rounded-lg">
            <MapPin size={12} />
            <span className="truncate max-w-[150px]">{item.location}</span>
          </div>
        )}

        {item.categories && (
          <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1.5 rounded-lg">
            <Tag size={12} />
            <span>{item.categories.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
