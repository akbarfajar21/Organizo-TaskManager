import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { Calendar, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";

export default function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    activity_date: "",
    start_time: "",
    end_time: "",
    category_id: "",
    location: "",
    is_completed: false,
  });

  const fetchActivities = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*, categories(name)")
      .eq("user_id", user.id)
      .order("activity_date", { ascending: false })
      .order("start_time", { ascending: true });

    if (!error) {
      setActivities(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .eq("user_id", user.id);
    setCategories(data || []);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchActivities();
    fetchCategories();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`activities-page-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.activity_date) return;

    const validCategoryId = form.category_id ? form.category_id : null;

    try {
      if (editData) {
        const { error } = await supabase
          .from("activities")
          .update({ ...form, category_id: validCategoryId })
          .eq("id", editData.id);

        if (error) {
          Swal.fire("Gagal!", "Gagal memperbarui kegiatan.", "error");
          return;
        }
        Swal.fire("Berhasil!", "Kegiatan berhasil diperbarui.", "success");
      } else {
        const { error } = await supabase.from("activities").insert([
          {
            ...form,
            user_id: user.id,
            category_id: validCategoryId,
          },
        ]);

        if (error) {
          Swal.fire("Gagal!", "Gagal menambahkan kegiatan baru.", "error");
          return;
        }
        Swal.fire(
          "Berhasil!",
          "Kegiatan baru berhasil ditambahkan.",
          "success"
        );
      }

      setShowForm(false);
      setEditData(null);
      setForm({
        title: "",
        description: "",
        activity_date: "",
        start_time: "",
        end_time: "",
        category_id: "",
        location: "",
        is_completed: false,
      });
    } catch (err) {
      Swal.fire("Gagal!", "Terjadi kesalahan tak terduga.", "error");
    }
  };

  const handleEdit = (activity) => {
    setEditData(activity);
    setForm({
      title: activity.title || "",
      description: activity.description || "",
      activity_date: activity.activity_date || "",
      start_time: activity.start_time || "",
      end_time: activity.end_time || "",
      category_id: activity.category_id || "",
      location: activity.location || "",
      is_completed: activity.is_completed || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Kegiatan ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        Swal.fire("Gagal!", "Gagal menghapus kegiatan.", "error");
      } else {
        Swal.fire("Dihapus!", "Kegiatan telah dihapus.", "success");
        setActivities((prev) => prev.filter((a) => a.id !== id));
      }
    }
  };

  const handleComplete = async (activity) => {
    const { error } = await supabase
      .from("activities")
      .update({ is_completed: !activity.is_completed })
      .eq("id", activity.id);

    if (!error) {
      Swal.fire(
        activity.is_completed
          ? "Kegiatan Ditandai Belum Selesai"
          : "Kegiatan Ditandai Selesai",
        "",
        activity.is_completed ? "info" : "success"
      );
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayActivities = activities.filter(
    (a) => a.activity_date === todayStr
  );
  const upcomingActivities = activities.filter(
    (a) => a.activity_date > todayStr
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
          Kegiatan
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditData(null);
            setForm({
              title: "",
              description: "",
              activity_date: "",
              start_time: "",
              end_time: "",
              category_id: "",
              location: "",
              is_completed: false,
            });
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold shadow transition"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* Form Modal - sama seperti sebelumnya */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-5 relative space-y-3"
          >
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditData(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              aria-label="Tutup"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              {editData ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </h2>

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Judul kegiatan"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  placeholder="Deskripsi (opsional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="activity_date"
                    value={form.activity_date}
                    onChange={handleChange}
                    required
                    className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Kategori
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id || ""}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">-</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Mulai
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Selesai
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Lokasi
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Lokasi (opsional)"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_completed"
                  checked={form.is_completed}
                  onChange={handleChange}
                  id="is_completed"
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_completed"
                  className="text-xs font-medium text-gray-700 dark:text-gray-200"
                >
                  Tandai selesai
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition"
            >
              {editData ? "Simpan Perubahan" : "Tambah"}
            </button>
          </form>
        </div>
      )}

      {/* List Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Memuat...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Belum ada kegiatan.
          </div>
        ) : (
          <>
            {/* Kegiatan Hari Ini */}
            <div className="mb-6">
              <h2 className="text-base font-bold mb-3 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                Kegiatan Hari Ini
              </h2>
              {todayActivities.length === 0 ? (
                <div className="text-xs text-gray-400 ml-3">
                  Tidak ada kegiatan hari ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {todayActivities.map((a) => (
                    <div
                      key={a.id}
                      className="group p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => handleComplete(a)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                                a.is_completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-400"
                              }`}
                              title="Tandai selesai"
                            >
                              {a.is_completed ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <span />
                              )}
                            </button>
                            <span
                              className={`font-semibold text-sm ${
                                a.is_completed
                                  ? "line-through text-gray-400 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              {a.title}
                            </span>
                            {a.categories && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                {a.categories.name}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-2 ml-7">
                            <span className="flex items-center gap-1">
                              📅 {a.activity_date}
                              {a.start_time && ` • ${a.start_time.slice(0, 5)}`}
                              {a.end_time && ` - ${a.end_time.slice(0, 5)}`}
                            </span>
                            {a.location && (
                              <span className="flex items-center gap-1">
                                📍 {a.location}
                              </span>
                            )}
                          </div>
                          {a.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7 italic">
                              {a.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(a)}
                            className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kegiatan Mendatang */}
            <div>
              <h2 className="text-base font-bold mb-3 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                Kegiatan Mendatang
              </h2>
              {upcomingActivities.length === 0 ? (
                <div className="text-xs text-gray-400 ml-3">
                  Tidak ada kegiatan mendatang.
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingActivities.map((a) => (
                    <div
                      key={a.id}
                      className="group p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => handleComplete(a)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                                a.is_completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-400"
                              }`}
                              title="Tandai selesai"
                            >
                              {a.is_completed ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <span />
                              )}
                            </button>
                            <span
                              className={`font-semibold text-sm ${
                                a.is_completed
                                  ? "line-through text-gray-400 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              {a.title}
                            </span>
                            {a.categories && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                {a.categories.name}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-2 ml-7">
                            <span className="flex items-center gap-1">
                              📅 {a.activity_date}
                              {a.start_time && ` • ${a.start_time.slice(0, 5)}`}
                              {a.end_time && ` - ${a.end_time.slice(0, 5)}`}
                            </span>
                            {a.location && (
                              <span className="flex items-center gap-1">
                                📍 {a.location}
                              </span>
                            )}
                          </div>
                          {a.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7 italic">
                              {a.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(a)}
                            className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
