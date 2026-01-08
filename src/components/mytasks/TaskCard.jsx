import { FiFolder, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi"; // Pastikan FiFolder diimpor di sini

function TaskCard({ task, overdue, toggleDone, setEditTask, deleteTask }) {
  return (
    <article
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 hover:shadow-lg transition-all ${
        overdue
          ? "border-red-500"
          : task.is_done
          ? "border-green-500"
          : "border-blue-500"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <label className="flex gap-3 flex-1 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={task.is_done}
              onChange={() => toggleDone(task)} // Call toggleDone when checkbox is clicked
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 rounded border-gray-300 dark:border-gray-600 peer-checked:border-green-500 peer-checked:bg-green-500 transition-all duration-300 flex items-center justify-center group-hover:border-gray-400 dark:group-hover:border-gray-500">
              <svg
                className={`w-3 h-3 text-white transition-all duration-300 ${
                  task.is_done ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-sm mb-1 transition-all ${
                overdue
                  ? "text-red-600 dark:text-red-400"
                  : task.is_done
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-medium">
                <FiFolder size={12} />
                {task.category?.name || "Tanpa kategori"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                  overdue
                    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                    : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                }`}
              >
                <FiCalendar size={12} />
                {new Date(task.due_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </label>

        <div className="flex gap-1">
          <button
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 p-2 rounded-lg transition-all"
            onClick={() => setEditTask(task)}
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 p-2 rounded-lg transition-all"
            onClick={() => deleteTask(task.id)} // Call deleteTask when delete button is clicked
            title="Hapus"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
