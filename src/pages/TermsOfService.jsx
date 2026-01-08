import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, CheckCircle } from "lucide-react";

export default function TermsOfService() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Syarat & Ketentuan
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
                <CheckCircle className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pendahuluan</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Selamat datang di Organizo. Dengan mengakses dan menggunakan
              layanan kami, Anda setuju untuk terikat dengan syarat dan
              ketentuan berikut. Harap baca dengan seksama sebelum menggunakan
              platform kami.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Penerimaan Ketentuan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dengan mendaftar dan menggunakan Organizo, Anda menyatakan bahwa:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <span>
                  Anda berusia minimal 13 tahun atau memiliki izin dari orang
                  tua/wali
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <span>
                  Anda memberikan informasi yang akurat dan lengkap saat
                  registrasi
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <span>
                  Anda bertanggung jawab atas keamanan akun dan password Anda
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Penggunaan Layanan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Anda setuju untuk menggunakan Organizo hanya untuk tujuan yang sah
              dan sesuai dengan ketentuan berikut:
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-yellow-800">Dilarang:</strong>{" "}
                Menggunakan layanan untuk aktivitas ilegal, menyebarkan malware,
                spam, atau konten yang melanggar hak orang lain.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Hak Kekayaan Intelektual
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Semua konten, fitur, dan fungsionalitas Organizo (termasuk namun
              tidak terbatas pada teks, grafik, logo, dan software) adalah milik
              eksklusif Organizo dan dilindungi oleh hukum hak cipta
              internasional.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Pembatasan Tanggung Jawab
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Organizo disediakan "sebagaimana adanya" tanpa jaminan apapun.
              Kami tidak bertanggung jawab atas kerugian langsung, tidak
              langsung, atau konsekuensial yang timbul dari penggunaan layanan
              kami.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Perubahan Ketentuan
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu.
              Perubahan akan berlaku segera setelah dipublikasikan di halaman
              ini. Penggunaan berkelanjutan Anda atas layanan kami setelah
              perubahan dianggap sebagai penerimaan terhadap ketentuan baru.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Penghentian Akun
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami berhak menangguhkan atau menghentikan akun Anda jika Anda
              melanggar ketentuan ini atau terlibat dalam aktivitas yang
              merugikan platform atau pengguna lain.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Hukum yang Berlaku
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan
              hukum Republik Indonesia. Setiap sengketa akan diselesaikan di
              pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini,
              silakan hubungi kami:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> support@organizo.com
              </p>
              <p>
                <strong>Website:</strong> www.organizo.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
