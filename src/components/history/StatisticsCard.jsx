export default function StatisticsCard({
  icon: Icon,
  title,
  total,
  label,
  showProgress = false,
  progressRate = 0,
  bgColor,
  iconColor,
  badgeColor,
  badgeText,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          <Icon size={20} className={`sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
        <span
          className={`text-xs font-semibold ${badgeColor} px-2 py-1 rounded-full`}
        >
          {badgeText}
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        {total}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{label}</p>
      {showProgress && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`${title === "Tugas" ? "bg-blue-500" : "bg-purple-500"} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progressRate}%` }}
            ></div>
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {progressRate}%
          </span>
        </div>
      )}
    </div>
  );
}
