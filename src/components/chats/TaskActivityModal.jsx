export default function TaskActivityModal({
  showModal,
  setShowModal,
  tasks,
  activities,
  sendMessage,
}) {
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={() => setShowModal(false)} // klik backdrop tutup modal
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full max-h-[70vh] overflow-y-auto p-5 mx-4"
        onClick={(e) => e.stopPropagation()} // cegah klik di modal menutup modal
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            id="modal-title"
            className="text-base font-semibold text-gray-900 dark:text-gray-100"
          >
            Pilih Tugas atau Kegiatan
          </h2>
          <button
            onClick={() => setShowModal(false)}
            aria-label="Tutup modal"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-2xl leading-none font-light select-none"
          >
            &times;
          </button>
        </div>

        {/* Tasks Section */}
        <section aria-labelledby="tasks-label" className="mb-5">
          <h3
            id="tasks-label"
            className="mb-2 font-semibold text-gray-800 dark:text-gray-200 text-sm"
          >
            Tugas
          </h3>

          {tasks.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-3">
              Tidak ada tugas
            </p>
          ) : (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  setShowModal(false);
                  sendMessage("task", task);
                }}
                className="w-full text-left p-2 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 text-sm"
                type="button"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {task.tittle}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                  {task.description}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                  Deadline:{" "}
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "-"}
                </div>
              </button>
            ))
          )}
        </section>

        {/* Activities Section */}
        <section aria-labelledby="activities-label">
          <h3
            id="activities-label"
            className="mb-2 font-semibold text-gray-800 dark:text-gray-200 text-sm"
          >
            Kegiatan
          </h3>

          {activities.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-3">
              Tidak ada kegiatan
            </p>
          ) : (
            activities.map((act) => (
              <button
                key={act.id}
                onClick={() => {
                  setShowModal(false);
                  sendMessage("activity", act);
                }}
                className="w-full text-left p-2 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 text-sm"
                type="button"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {act.tittle}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                  {act.description}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-0.5 truncate">
                  {act.activity_date
                    ? new Date(act.activity_date).toLocaleDateString()
                    : "-"}{" "}
                  | {act.start_time} - {act.end_time}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-400 truncate">
                  {act.location}
                </div>
              </button>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
