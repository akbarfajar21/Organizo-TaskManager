import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <Icon className={iconColor} size={24} />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getTrendColor()}`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
};

export default SummaryCard;
