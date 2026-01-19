import { Calendar } from "lucide-react";

export default function ActivityStatusChart({
  completedActivities,
  pendingActivities,
  activityCompletionRate,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
        Status Kegiatan
      </h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="35%"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50%"
              cy="50%"
              r="35%"
              fill="none"
              stroke="url(#gradient-completed)"
              strokeWidth="20"
              strokeDasharray={`${activityCompletionRate * 2.2} 220`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient
                id="gradient-completed"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {activityCompletionRate}%
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Selesai
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selesai
            </span>
          </div>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {completedActivities}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Belum Selesai
            </span>
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
            {pendingActivities}
          </span>
        </div>
      </div>
    </div>
  );
}
