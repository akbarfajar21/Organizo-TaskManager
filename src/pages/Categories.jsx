import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FolderOpen, Plus, Trash2, Edit2, Check, X, Tag } from "lucide-react";

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at");

    setCategories(data || []);
    setLoading(false);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Nama kategori tidak boleh kosong!",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    const { error } = await supabase.from("categories").insert({
      user_id: user.id,
      name: name.trim(),
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menambah kategori",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setName("");
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Kategori berhasil ditambahkan",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });
    fetchCategories();
  };

  const deleteCategory = async (id, name) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Kategori?",
      text: `Kategori "${name}" akan dihapus`,
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      if (error.code === "23503") {
        Swal.fire({
          icon: "error",
          title: "Tidak Bisa Dihapus",
          html: `
          Kategori <b>"${name}"</b> tidak dapat dihapus karena
          masih digunakan pada beberapa tugas atau kegiatan.<br/><br/>
          <small>Silakan pindahkan atau hapus tugas terkait terlebih dahulu.</small>
        `,
          confirmButtonColor: "#FBBF24",
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus kategori",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Terhapus!",
      text: `Kategori "${name}" berhasil dihapus`,
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });

    fetchCategories();
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Nama kategori tidak boleh kosong!",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    const { error } = await supabase
      .from("categories")
      .update({ name: editingName.trim() })
      .eq("id", id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengupdate kategori",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setEditingId(null);
    setEditingName("");
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Kategori berhasil diupdate",
      confirmButtonColor: "#FBBF24",
      timer: 2000,
      showConfirmButton: false,
    });
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Memuat kategori...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
        {/* Header - Responsive */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="text-white" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
              Kategori Tugas
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              Kelola kategori untuk mengorganisir tugas Anda
            </p>
          </div>
        </div>

        {/* Add Form - Responsive */}
        <form
          onSubmit={addCategory}
          className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6"
        >
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tambah Kategori Baru
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Tag
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={14}
              />
              <input
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg pl-8 sm:pl-10 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Contoh: Pekerjaan, Pribadi, Kuliah..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              Tambah
            </button>
          </div>
        </form>

        {/* Categories List - Responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5 sm:gap-2">
              <Tag size={14} className="sm:w-4 sm:h-4" />
              Daftar Kategori ({categories.length})
            </h3>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FolderOpen
                  className="text-gray-400 dark:text-gray-500"
                  size={24}
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-semibold mb-1">
                Belum ada kategori
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Tambahkan kategori pertama Anda di atas
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  {editingId === cat.id ? (
                    /* Edit Mode - Responsive */
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <input
                        className="flex-1 border border-yellow-300 dark:border-yellow-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <button
                        onClick={() => saveEdit(cat.id)}
                        className="p-1.5 sm:p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex-shrink-0"
                        title="Simpan"
                      >
                        <Check size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 sm:p-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white rounded-lg transition-colors flex-shrink-0"
                        title="Batal"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    /* View Mode - Responsive */
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Tag
                            className="text-yellow-600 dark:text-yellow-400"
                            size={12}
                          />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-100 truncate">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit kategori"
                        >
                          <Edit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id, cat.name)}
                          className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Hapus kategori"
                        >
                          <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box - Responsive */}
        {categories.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">💡</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  Tips Penggunaan Kategori
                </p>
                <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Gunakan kategori untuk mengelompokkan tugas berdasarkan
                  konteks seperti "Pekerjaan", "Pribadi", "Kuliah", atau
                  "Proyek". Ini membantu Anda fokus pada tugas yang relevan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
