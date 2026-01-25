import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Scale,
  UserX,
  RefreshCw,
  Mail,
  Globe,
  Gavel,
} from "lucide-react";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Organizo - Syarat & Ketentuan";
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FileText className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Syarat & Ketentuan
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
                <CheckCircle
                  className="text-blue-600 dark:text-blue-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Pendahuluan
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Selamat datang di Organizo. Dengan mengakses dan menggunakan
              layanan kami, Anda setuju untuk terikat dengan syarat dan
              ketentuan berikut. Harap baca dengan seksama sebelum menggunakan
              platform kami.
            </p>
          </section>

          {/* Section 1 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield
                  className="text-green-600 dark:text-green-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                1. Penerimaan Ketentuan
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Dengan mendaftar dan menggunakan Organizo, Anda menyatakan bahwa:
            </p>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle
                  className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <span>
                  Anda berusia minimal 13 tahun atau memiliki izin dari orang
                  tua/wali
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle
                  className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <span>
                  Anda memberikan informasi yang akurat dan lengkap saat
                  registrasi
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle
                  className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <span>
                  Anda bertanggung jawab atas keamanan akun dan password Anda
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle
                  className="text-yellow-600 dark:text-yellow-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                2. Penggunaan Layanan
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Anda setuju untuk menggunakan Organizo hanya untuk tujuan yang sah
              dan sesuai dengan ketentuan berikut:
            </p>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-3 sm:p-4 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-yellow-800 dark:text-yellow-400">
                  Dilarang:
                </strong>{" "}
                Menggunakan layanan untuk aktivitas ilegal, menyebarkan malware,
                spam, atau konten yang melanggar hak orang lain.
              </p>
            </div>
          </section>

          {/* Section 3 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale
                  className="text-purple-600 dark:text-purple-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                3. Hak Kekayaan Intelektual
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Semua konten, fitur, dan fungsionalitas Organizo (termasuk namun
              tidak terbatas pada teks, grafik, logo, dan software) adalah milik
              eksklusif Organizo dan dilindungi oleh hukum hak cipta
              internasional.
            </p>
          </section>

          {/* Section 4 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle
                  className="text-red-600 dark:text-red-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                4. Pembatasan Tanggung Jawab
              </h2>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200 dark:border-red-800">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Organizo disediakan <strong>"sebagaimana adanya"</strong> tanpa
                jaminan apapun. Kami tidak bertanggung jawab atas kerugian
                langsung, tidak langsung, atau konsekuensial yang timbul dari
                penggunaan layanan kami.
              </p>
            </div>
          </section>

          {/* Section 5 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <RefreshCw
                  className="text-indigo-600 dark:text-indigo-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                5. Perubahan Ketentuan
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu.
              Perubahan akan berlaku segera setelah dipublikasikan di halaman
              ini. Penggunaan berkelanjutan Anda atas layanan kami setelah
              perubahan dianggap sebagai penerimaan terhadap ketentuan baru.
            </p>
          </section>

          {/* Section 6 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <UserX
                  className="text-orange-600 dark:text-orange-400"
                  size={16}
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                6. Penghentian Akun
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Kami berhak menangguhkan atau menghentikan akun Anda jika Anda
              melanggar ketentuan ini atau terlibat dalam aktivitas yang
              merugikan platform atau pengguna lain.
            </p>
          </section>

          {/* Section 7 - Responsive */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 dark:bg-teal-900/40 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Gavel className="text-teal-600 dark:text-teal-400" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                7. Hukum yang Berlaku
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan
              hukum Republik Indonesia. Setiap sengketa akan diselesaikan di
              pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          {/* Contact - Responsive */}
          <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              Hubungi Kami
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini,
              silakan hubungi kami:
            </p>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <Mail
                  size={14}
                  className="sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                />
                <strong className="flex-shrink-0">Email:</strong>
                <span className="break-all">support@organizo.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe
                  size={14}
                  className="sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                />
                <strong className="flex-shrink-0">Website:</strong>
                <span className="break-all">www.organizo.com</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
