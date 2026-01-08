// src/components/chats/TaskActivityModal.jsx
export default function TaskActivityModal({
  showModal,
  setShowModal,
  tasks,
  activities,
  sendMessage,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pilih Tugas atau Kegiatan
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
            Tugas
          </div>

          {tasks.length === 0 && (
            <div className="text-gray-400 dark:text-gray-500 text-sm mb-2">
              Tidak ada tugas
            </div>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer mb-1"
              onClick={() => {
                setShowModal(false);
                sendMessage("task", task);
              }}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {task.tittle}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                {task.description}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-400">
                Deadline:{" "}
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          ))}
        </div>

        {/* Activities Section */}
        <div className="mt-4 mb-2 font-semibold text-gray-800 dark:text-gray-200">
          Kegiatan
        </div>

        {activities.length === 0 && (
          <div className="text-gray-400 dark:text-gray-500 text-sm mb-2">
            Tidak ada kegiatan
          </div>
        )}

        {activities.map((act) => (
          <div
            key={act.id}
            className="p-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer mb-1"
            onClick={() => {
              setShowModal(false);
              sendMessage("activity", act);
            }}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {act.tittle}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-300">
              {act.description}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-400">
              {act.activity_date
                ? new Date(act.activity_date).toLocaleDateString()
                : "-"}{" "}
              | {act.start_time} - {act.end_time}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-400">
              {act.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
