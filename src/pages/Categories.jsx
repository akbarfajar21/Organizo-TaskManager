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

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Kategori?",
      text: "Tugas dengan kategori ini tidak akan terhapus",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus kategori",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Terhapus!",
      text: "Kategori berhasil dihapus",
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
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
            <FolderOpen className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Kategori Tugas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kelola kategori untuk mengorganisir tugas Anda
            </p>
          </div>
        </div>

        {/* Add Form */}
        <form
          onSubmit={addCategory}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tambah Kategori Baru
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Tag
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={16}
              />
              <input
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Contoh: Pekerjaan, Pribadi, Kuliah..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={16} />
              Tambah
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Tag size={16} />
              Daftar Kategori ({categories.length})
            </h3>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen
                  className="text-gray-400 dark:text-gray-500"
                  size={32}
                />
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                Belum ada kategori
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tambahkan kategori pertama Anda di atas
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  {editingId === cat.id ? (
                    /* Edit Mode */
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 border border-yellow-300 dark:border-yellow-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        title="Simpan"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white rounded-lg transition-colors"
                        title="Batal"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
                          <Tag
                            className="text-yellow-600 dark:text-yellow-400"
                            size={14}
                          />
                        </div>
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit kategori"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Hapus kategori"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        {categories.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💡</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  Tips Penggunaan Kategori
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
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
