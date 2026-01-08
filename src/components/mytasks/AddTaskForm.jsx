import { FiPlus } from "react-icons/fi"; // Pastikan FiPlus diimpor di sini

function AddTaskForm({
  categories,
  title,
  description,
  dueDate,
  categoryId,
  setTitle,
  setDescription,
  setDueDate,
  setCategoryId,
  addTask,
}) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <FiPlus className="text-yellow-500" size={24} /> Tambah Tugas Baru
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent form default submission
          addTask(); // Call the addTask function
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Judul Tugas
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Masukkan judul tugas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deskripsi
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            rows={3}
            placeholder="Tambahkan deskripsi (opsional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={dueDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
