function TaskSection({ title, icon: Icon, color, count, children }) {
  const colors = {
    red: "from-red-500 to-red-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}
        >
          <Icon className="text-white" size={16} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}{" "}
          <span className="text-sm text-gray-400 dark:text-gray-500">
            ({count})
          </span>
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default TaskSection;
