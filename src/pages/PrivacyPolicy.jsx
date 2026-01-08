import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Kebijakan Privasi
              </h1>
              <p className="text-gray-600 mt-1">
                Terakhir diperbarui: 1 Januari 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Lock className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pendahuluan</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Di Organizo, kami sangat menghargai privasi Anda. Kebijakan
              Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
              dan melindungi informasi pribadi Anda saat menggunakan layanan
              kami.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Database className="text-green-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Informasi yang Kami Kumpulkan
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami mengumpulkan informasi berikut saat Anda menggunakan
              Organizo:
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">Informasi Akun</h3>
                <p className="text-gray-700 text-sm">
                  Nama lengkap, alamat email, dan foto profil (jika Anda login
                  dengan Google)
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-2">
                  Data Penggunaan
                </h3>
                <p className="text-gray-700 text-sm">
                  Tugas yang Anda buat, kategori, deadline, dan status
                  penyelesaian
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-2">
                  Informasi Teknis
                </h3>
                <p className="text-gray-700 text-sm">
                  Alamat IP, jenis browser, sistem operasi, dan waktu akses
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Eye className="text-yellow-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                2. Bagaimana Kami Menggunakan Informasi Anda
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span>Menyediakan dan meningkatkan layanan Organizo</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span>Mengirimkan notifikasi tentang deadline tugas</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span>Menganalisis penggunaan untuk meningkatkan fitur</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span>Mencegah penyalahgunaan dan aktivitas ilegal</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Lock className="text-red-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Keamanan Data
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami menggunakan langkah-langkah keamanan teknis dan organisasi
              untuk melindungi data Anda:
            </p>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <Shield className="text-red-600 flex-shrink-0" size={20} />
                  <span>Enkripsi data saat transit dan penyimpanan</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="text-red-600 flex-shrink-0" size={20} />
                  <span>Autentikasi dua faktor (opsional)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="text-red-600 flex-shrink-0" size={20} />
                  <span>Pemantauan keamanan 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="text-red-600 flex-shrink-0" size={20} />
                  <span>Backup data secara berkala</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserCheck className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Berbagi Informasi
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kami <strong>TIDAK</strong> menjual, menyewakan, atau membagikan
              informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.
              Informasi Anda hanya dibagikan dalam kondisi berikut:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Dengan persetujuan eksplisit Anda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Untuk mematuhi kewajiban hukum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>
                  Dengan penyedia layanan yang membantu operasional kami
                </span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Hak Anda
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Anda memiliki hak untuk:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Akses Data</h3>
                <p className="text-gray-600 text-sm">
                  Meminta salinan data pribadi Anda
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Koreksi Data</h3>
                <p className="text-gray-600 text-sm">
                  Memperbarui informasi yang tidak akurat
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Hapus Data</h3>
                <p className="text-gray-600 text-sm">
                  Menghapus akun dan data Anda
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Portabilitas</h3>
                <p className="text-gray-600 text-sm">
                  Mengekspor data Anda dalam format standar
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookies dan Teknologi Pelacakan
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami menggunakan cookies untuk meningkatkan pengalaman Anda.
              Cookies membantu kami mengingat preferensi Anda dan menganalisis
              penggunaan layanan. Anda dapat mengatur browser untuk menolak
              cookies, namun beberapa fitur mungkin tidak berfungsi optimal.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Perubahan Kebijakan
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Perubahan signifikan akan kami beritahukan melalui email atau
              notifikasi di platform. Penggunaan berkelanjutan Anda setelah
              perubahan dianggap sebagai penerimaan terhadap kebijakan baru.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau
              ingin menggunakan hak Anda, silakan hubungi kami:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> privacy@organizo.com
              </p>
              <p>
                <strong>Website:</strong> www.organizo.com
              </p>
              <p>
                <strong>Alamat:</strong> Jakarta, Indonesia
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
