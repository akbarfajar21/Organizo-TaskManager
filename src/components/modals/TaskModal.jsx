import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import Swal from "sweetalert2";
import {
  X,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from "lucide-react";

export default function TaskModal({ task, onClose, onUpdate }) {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("tasks")
      .update({ is_done: !task.is_done })
      .eq("id", task.id);

    if (error) {
      showToast({ type: "error", message: "Gagal mengubah status tugas" });
    } else {
      showToast({
        type: "success",
        message: task.is_done ? "Tugas dibuka kembali" : "Tugas diselesaikan!",
      });
      onUpdate();
      onClose();
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Tugas?",
      text: "Tugas yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);

    if (error) {
      showToast({ type: "error", message: "Gagal menghapus tugas" });
    } else {
      await Swal.fire({
        title: "Terhapus!",
        text: "Tugas berhasil dihapus",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      onUpdate();
      onClose();
    }
    setIsDeleting(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isOverdue = task.due_date < new Date().toISOString().slice(0, 10);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {task.title}
            </h2>
            <div className="flex items-center gap-2">
              {task.is_done ? (
                <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-md font-medium">
                  <CheckCircle2 size={14} />
                  Selesai
                </span>
              ) : isOverdue ? (
                <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2.5 py-1 rounded-md font-medium">
                  <AlertCircle size={14} />
                  Terlambat
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs px-2.5 py-1 rounded-md font-medium">
                  <Clock size={14} />
                  Aktif
                </span>
              )}
              {task.priority && (
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    task.priority === "high"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : task.priority === "medium"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  }`}
                >
                  {task.priority === "high"
                    ? "Prioritas Tinggi"
                    : task.priority === "medium"
                      ? "Prioritas Sedang"
                      : "Prioritas Rendah"}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3">
            {/* Due Date */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Deadline
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {formatDate(task.due_date)}
                </p>
              </div>
            </div>

            {/* Due Time */}
            {task.due_time && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock
                    size={18}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Waktu
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {task.due_time.slice(0, 5)} WIB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleToggleComplete}
              disabled={isUpdating}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                task.is_done
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : task.is_done ? (
                  <>
                    <Clock size={18} />
                    Buka Kembali
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Tandai Selesai
                  </>
                )}
              </span>
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="sm:w-auto py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Hapus
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
