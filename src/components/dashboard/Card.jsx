const Card = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        {Icon && (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
            <Icon size={14} className="sm:w-4 sm:h-4 text-white" />
          </div>
        )}
        <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

export default Card;
