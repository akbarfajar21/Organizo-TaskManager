const SummaryCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  bgColor,
  iconColor,
  trend,
  trendType,
}) => {
  const getTrendColor = () => {
    switch (trendType) {
      case "up":
        return "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400";
      case "down":
        return "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400";
      case "good":
        return "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400";
      case "bad":
        return "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <Icon className={iconColor} size={20} />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${getTrendColor()}`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
};

export default SummaryCard;
