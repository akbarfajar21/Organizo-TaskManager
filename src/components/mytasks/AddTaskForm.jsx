import { FiPlus } from "react-icons/fi";

function AddTaskForm({
  categories,
  title,
  description,
  dueDate,
  dueTime,
  categoryId,
  setTitle,
  setDescription,
  setDueDate,
  setDueTime,
  setCategoryId,
  addTask,
}) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2">
        <FiPlus className="text-yellow-500" size={20} /> Tambah Tugas Baru
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        className="space-y-4"
      >
        {/* Input Judul */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Judul Tugas
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Masukkan judul tugas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deskripsi
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            rows={3}
            placeholder="Tambahkan deskripsi (opsional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* ⭐ LAYOUT BARU: Deadline Section */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Deadline
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Input Tanggal */}
            <div>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={dueDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Input Jam */}
            <div>
              <input
                type="time"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Kategori dan Tombol */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Input Kategori */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Tanpa kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Tambah */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiPlus size={18} /> Tambah Tugas
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default AddTaskForm;
