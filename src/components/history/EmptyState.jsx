import { History as HistoryIcon } from "lucide-react";

export default function EmptyState({ searchQuery }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <HistoryIcon size={32} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
        Tidak ada data
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {searchQuery
          ? "Tidak ada hasil yang cocok dengan pencarian Anda"
          : "Belum ada tugas atau kegiatan yang tercatat"}
      </p>
    </div>
  );
}
