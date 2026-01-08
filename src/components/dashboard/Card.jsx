const Card = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
      <div className="flex items-center gap-2 mb-4">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
            <Icon size={16} className="text-white" />
          </div>
        )}
        <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

export default Card;
