import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  FileText,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => {
      document.title = "Organizo - Kebijakan Privasi";
    }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header - Responsive */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-semibold transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Kebijakan Privasi
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                Terakhir diperbarui: 1 Januari 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Responsive */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-12 space-y-6 sm:space-y-8">
          {/* Introduction - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="text-blue-600 dark:text-blue-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Pendahuluan
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Di Organizo, kami sangat menghargai privasi Anda. Kebijakan
              Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
              dan melindungi informasi pribadi Anda saat menggunakan layanan
              kami.
            </p>
          </section>

          {/* Section 1 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="text-green-600 dark:text-green-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                1. Informasi yang Kami Kumpulkan
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Kami mengumpulkan informasi berikut saat Anda menggunakan
              Organizo:
            </p>

            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Informasi Akun
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Nama lengkap, alamat email, dan foto profil (jika Anda login
                  dengan Google)
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Data Penggunaan
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Tugas yang Anda buat, kategori, deadline, dan status
                  penyelesaian
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Informasi Teknis
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Alamat IP, jenis browser, sistem operasi, dan waktu akses
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="text-yellow-600 dark:text-yellow-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                2. Bagaimana Kami Menggunakan Informasi Anda
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
                </div>
                <span>Menyediakan dan meningkatkan layanan Organizo</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
                </div>
                <span>Mengirimkan notifikasi tentang deadline tugas</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
                </div>
                <span>Menganalisis penggunaan untuk meningkatkan fitur</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
                </div>
                <span>Mencegah penyalahgunaan dan aktivitas ilegal</span>
              </li>
            </ul>
          </section>

          {/* Section 3 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="text-red-600 dark:text-red-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                3. Keamanan Data
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Kami menggunakan langkah-langkah keamanan teknis dan organisasi
              untuk melindungi data Anda:
            </p>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200 dark:border-red-800">
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Shield className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                  <span>Enkripsi data saat transit dan penyimpanan</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Shield className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                  <span>Autentikasi dua faktor (opsional)</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Shield className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                  <span>Pemantauan keamanan 24/7</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Shield className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                  <span>Backup data secara berkala</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <UserCheck className="text-purple-600 dark:text-purple-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                4. Berbagi Informasi
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Kami <strong>TIDAK</strong> menjual, menyewakan, atau membagikan
              informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.
              Informasi Anda hanya dibagikan dalam kondisi berikut:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">•</span>
                <span>Dengan persetujuan eksplisit Anda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">•</span>
                <span>Untuk mematuhi kewajiban hukum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">•</span>
                <span>
                  Dengan penyedia layanan yang membantu operasional kami
                </span>
              </li>
            </ul>
          </section>

          {/* Section 5 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-indigo-600 dark:text-indigo-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                5. Hak Anda
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Anda memiliki hak untuk:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Akses Data
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Meminta salinan data pribadi Anda
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Koreksi Data
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Memperbarui informasi yang tidak akurat
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Hapus Data
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Menghapus akun dan data Anda
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  Portabilitas
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Mengekspor data Anda dalam format standar
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 - Responsive */}
          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              6. Cookies dan Teknologi Pelacakan
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Kami menggunakan cookies untuk meningkatkan pengalaman Anda.
              Cookies membantu kami mengingat preferensi Anda dan menganalisis
              penggunaan layanan. Anda dapat mengatur browser untuk menolak
              cookies, namun beberapa fitur mungkin tidak berfungsi optimal.
            </p>
          </section>

          {/* Section 7 - Responsive */}
          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              7. Perubahan Kebijakan
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Perubahan signifikan akan kami beritahukan melalui email atau
              notifikasi di platform. Penggunaan berkelanjutan Anda setelah
              perubahan dianggap sebagai penerimaan terhadap kebijakan baru.
            </p>
          </section>

          {/* Contact - Responsive */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              Hubungi Kami
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau
              ingin menggunakan hak Anda, silakan hubungi kami:
            </p>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <Mail size={14} className="sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <strong className="flex-shrink-0">Email:</strong>
                <span className="break-all">privacy@organizo.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe size={14} className="sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <strong className="flex-shrink-0">Website:</strong>
                <span className="break-all">www.organizo.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <strong className="flex-shrink-0">Alamat:</strong>
                <span>Jakarta, Indonesia</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
