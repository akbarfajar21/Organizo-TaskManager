import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  X,
} from "lucide-react";

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

  useEffect(() => {
    document.title = "Organizo - Kegiatan";
  }, []);

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
        },
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
      let activityId;
      let isNewActivity = false;

      if (editData) {
        // Update kegiatan yang sudah ada
        const { error } = await supabase
          .from("activities")
          .update({ ...form, category_id: validCategoryId })
          .eq("id", editData.id);

        if (error) {
          console.error("Error updating activity:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: `Gagal memperbarui kegiatan: ${error.message}`,
            confirmButtonColor: "#FBBF24",
          });
          return;
        }
        activityId = editData.id;
      } else {
        // Tambahkan kegiatan baru - GUNAKAN .select() untuk mendapatkan data yang baru dibuat
        const { data, error } = await supabase
          .from("activities")
          .insert([
            {
              ...form,
              user_id: user.id,
              category_id: validCategoryId,
            },
          ])
          .select(); // PENTING: Tambahkan .select() untuk mendapatkan data yang baru dibuat

        if (error) {
          console.error("Error creating activity:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: `Gagal menambahkan kegiatan baru: ${error.message}`,
            confirmButtonColor: "#FBBF24",
          });
          return;
        }

        // Pastikan data ada dan ambil ID-nya
        if (!data || data.length === 0) {
          console.error("No data returned from insert");
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Gagal mendapatkan ID kegiatan yang baru dibuat.",
            confirmButtonColor: "#FBBF24",
          });
          return;
        }

        activityId = data[0].id;
        isNewActivity = true;
      }

      // Hanya buat notifikasi untuk kegiatan BARU (bukan edit)
      if (isNewActivity) {
        const { error: notifError } = await supabase
          .from("notifications")
          .insert([
            {
              user_id: user.id,
              title: `Kegiatan Baru: ${form.title}`,
              message: `Kegiatan baru Anda telah ditambahkan untuk ${new Date(
                form.activity_date,
              ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`,
              created_at: new Date().toISOString(),
              type: "activity",
              is_read: false,
              activity_id: activityId,
            },
          ]);

        if (notifError) {
          console.error("Error creating notification:", notifError);
          // Jangan return - kegiatan sudah berhasil dibuat, notifikasi hanya bonus
          Swal.fire({
            icon: "warning",
            title: "Perhatian!",
            text: "Kegiatan berhasil ditambahkan, tapi notifikasi gagal dibuat.",
            confirmButtonColor: "#FBBF24",
          });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: editData
          ? "Kegiatan berhasil diperbarui."
          : "Kegiatan baru berhasil ditambahkan.",
        confirmButtonColor: "#FBBF24",
        timer: 2000,
        showConfirmButton: false,
      });

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
      console.error("Unexpected error:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Terjadi kesalahan tak terduga: ${err.message}`,
        confirmButtonColor: "#FBBF24",
      });
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
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus kegiatan.",
          confirmButtonColor: "#FBBF24",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Dihapus!",
          text: "Kegiatan telah dihapus.",
          confirmButtonColor: "#FBBF24",
          timer: 2000,
          showConfirmButton: false,
        });
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
      Swal.fire({
        icon: activity.is_completed ? "info" : "success",
        title: activity.is_completed
          ? "Kegiatan Ditandai Belum Selesai"
          : "Kegiatan Ditandai Selesai",
        confirmButtonColor: "#FBBF24",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayActivities = activities.filter(
    (a) => a.activity_date === todayStr,
  );
  const upcomingActivities = activities.filter(
    (a) => a.activity_date > todayStr,
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Calendar
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
              Kegiatan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Kelola jadwal kegiatan Anda
            </p>
          </div>
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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            <span>Tambah Kegiatan</span>
          </button>
        </div>

        {/* Form Modal - Responsive */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editData ? "Edit Kegiatan" : "Tambah Kegiatan"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditData(null);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-4 sm:px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Judul kegiatan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Deskripsi kegiatan (opsional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="activity_date"
                      value={form.activity_date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                      Kategori
                    </label>
                    <select
                      name="category_id"
                      value={form.category_id || ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Tanpa kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                      Waktu Mulai
                    </label>
                    <input
                      type="time"
                      name="start_time"
                      value={form.start_time}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                      Waktu Selesai
                    </label>
                    <input
                      type="time"
                      name="end_time"
                      value={form.end_time}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    Lokasi
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Lokasi kegiatan (opsional)"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                  >
                    Tandai sebagai selesai
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditData(null);
                  }}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold text-sm transition shadow-md"
                >
                  {editData ? "Simpan Perubahan" : "Tambah Kegiatan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Memuat kegiatan...
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar
                size={48}
                className="text-gray-300 dark:text-gray-600 mb-3"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Belum ada kegiatan
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Klik tombol "Tambah Kegiatan" untuk memulai
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Kegiatan Hari Ini */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h2 className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-400">
                    Kegiatan Hari Ini
                  </h2>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                    {todayActivities.length}
                  </span>
                </div>
                {todayActivities.length === 0 ? (
                  <div className="text-sm text-gray-400 dark:text-gray-500 ml-3 py-4 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    Tidak ada kegiatan hari ini
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayActivities.map((a) => (
                      <ActivityCard
                        key={a.id}
                        activity={a}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Kegiatan Mendatang */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h2 className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-400">
                    Kegiatan Mendatang
                  </h2>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                    {upcomingActivities.length}
                  </span>
                </div>
                {upcomingActivities.length === 0 ? (
                  <div className="text-sm text-gray-400 dark:text-gray-500 ml-3 py-4 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    Tidak ada kegiatan mendatang
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingActivities.map((a) => (
                      <ActivityCard
                        key={a.id}
                        activity={a}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== ACTIVITY CARD COMPONENT ===== */
function ActivityCard({ activity, onEdit, onDelete, onComplete }) {
  return (
    <div className="group p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 hover:from-blue-50 hover:to-sky-50 dark:hover:from-blue-900/20 dark:hover:to-sky-900/10 transition-all border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onComplete(activity)}
          className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
            activity.is_completed
              ? "border-green-500 bg-green-500 text-white scale-110"
              : "border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 hover:border-green-500 dark:hover:border-green-400"
          }`}
          title={
            activity.is_completed ? "Tandai belum selesai" : "Tandai selesai"
          }
        >
          {activity.is_completed && <CheckCircle2 size={14} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Category */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3
              className={`font-semibold text-sm sm:text-base ${
                activity.is_completed
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {activity.title}
            </h3>
            {activity.categories && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                {activity.categories.name}
              </span>
            )}
          </div>

          {/* Date, Time, Location */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={14} className="flex-shrink-0" />
              {new Date(activity.activity_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {(activity.start_time || activity.end_time) && (
              <span className="flex items-center gap-1">
                <Clock size={14} className="flex-shrink-0" />
                {activity.start_time && activity.start_time.slice(0, 5)}
                {activity.start_time && activity.end_time && " - "}
                {activity.end_time && activity.end_time.slice(0, 5)}
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {activity.location}
                </span>
              </span>
            )}
          </div>

          {/* Description */}
          {activity.description && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">
              {activity.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(activity)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
