import { X, Mail, MapPin, Calendar, CheckSquare, Clock } from "lucide-react";

export default function UserProfileModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-24 bg-gradient-to-r from-yellow-400 to-amber-500">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 relative flex flex-col items-center text-center">
          {/* Avatar (pulled up over the banner) */}
          <div className="-mt-12 mb-3">
            <img
              src={user.avatar_url || "/default-avatar.png"}
              alt={user.full_name}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md bg-white mx-auto"
            />
          </div>

          <div className="mb-5 w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2 flex-wrap">
              {user.full_name}
              {user.role === "admin" && (
                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-yellow-200 uppercase tracking-wider">
                  Admin
                </span>
              )}
            </h2>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1.5 bg-gray-100 dark:bg-gray-700/50 inline-block px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700">
              ID: {user.user_id}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <Mail size={16} className="text-gray-400" />
              <span className="truncate">
                {user.email || "Email tidak tersedia"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
