function StatusBadge({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  };

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${colors[color]} shadow-sm`}
    >
      <Icon size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] font-medium opacity-80 uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-base sm:text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

export default StatusBadge;
