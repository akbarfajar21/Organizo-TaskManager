import { TrendingUp } from "lucide-react";

export default function TaskStatusChart({
  completedTasks,
  pendingTasks,
  totalTasks,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
        Status Tugas
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selesai
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {completedTasks}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
              style={{
                width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
                minWidth: totalTasks > 0 && completedTasks > 0 ? "60px" : "0",
              }}
            >
              {completedTasks > 0 && (
                <span className="text-xs font-bold text-white">
                  {totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0}
                  %
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Belum Selesai
            </span>
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              {pendingTasks}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
            <div
              className="bg-gradient-to-r from-yellow-500 to-amber-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
              style={{
                width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%`,
                minWidth: totalTasks > 0 && pendingTasks > 0 ? "60px" : "0",
              }}
            >
              {pendingTasks > 0 && (
                <span className="text-xs font-bold text-white">
                  {totalTasks > 0
                    ? Math.round((pendingTasks / totalTasks) * 100)
                    : 0}
                  %
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
