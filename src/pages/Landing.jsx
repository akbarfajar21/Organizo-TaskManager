import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  Bell,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Landing() {
  const [chartData, setChartData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      window.location.href = "/app";
    }
  }, []);

  useEffect(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    });

    const counts = [3, 5, 4, 6, 7, 8, 10];

    setChartData({
      labels: days,
      datasets: [
        {
          label: "Tugas Selesai",
          data: counts,
          fill: true,
          backgroundColor: "rgba(253, 224, 71, 0.3)",
          borderColor: "rgba(253, 224, 71, 1)",
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "rgba(253, 224, 71, 1)",
        },
      ],
    });
  }, []);

  function handleSmoothScroll(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* ================= NAVBAR - RESPONSIVE ================= */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 font-extrabold text-lg sm:text-xl"
          >
            <img
              src="/logo.png"
              alt="Organizo Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md"
            />
            <div className="leading-tight">
              <div>Organizo</div>
              <div className="text-xs font-normal text-gray-500">
                Task Manager
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 font-medium text-gray-700">
            <a
              href="#features"
              onClick={handleSmoothScroll}
              className="hover:text-yellow-500 transition"
            >
              Fitur
            </a>
            <a
              href="#how-it-works"
              onClick={handleSmoothScroll}
              className="hover:text-yellow-500 transition"
            >
              Cara Kerja
            </a>
            <a
              href="#benefits"
              onClick={handleSmoothScroll}
              className="hover:text-yellow-500 transition"
            >
              Keuntungan
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-yellow-500 font-semibold transition"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/login"
              className="text-gray-700 hover:text-yellow-500 font-semibold text-sm transition"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md transition"
            >
              Daftar
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                onClick={handleSmoothScroll}
                className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition"
              >
                Fitur
              </a>
              <a
                href="#how-it-works"
                onClick={handleSmoothScroll}
                className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition"
              >
                Cara Kerja
              </a>
              <a
                href="#benefits"
                onClick={handleSmoothScroll}
                className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition"
              >
                Keuntungan
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION - RESPONSIVE ================= */}
      <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/80 backdrop-blur-sm text-yellow-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm border border-yellow-200">
            Kelola Hidup Anda Lebih Baik
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight px-4">
            Produktivitas Dimulai
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600">
              Dari Organizo
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            Platform manajemen tugas all-in-one yang membantu Anda mengorganisir
            pekerjaan, melacak deadline, dan meningkatkan produktivitas dengan
            cara yang sederhana dan elegan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 max-w-md mx-auto px-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Mulai Gratis Sekarang{" "}
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/login"
              className="bg-white border border-gray-300 text-gray-800 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow hover:shadow-md transition text-sm sm:text-base"
            >
              Lihat Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">
              Fitur Unggulan Organizo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola tugas dan meningkatkan
              produktivitas dalam satu platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 border border-yellow-100">
              <div className="bg-yellow-400 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Manajemen Tugas</h3>
              <p className="text-gray-600 leading-relaxed">
                Buat, edit, dan kelola tugas dengan mudah. Atur prioritas dan
                status untuk setiap tugas Anda.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 border border-blue-100">
              <div className="bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md">
                <Calendar className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Kalender Terintegrasi</h3>
              <p className="text-gray-600 leading-relaxed">
                Lihat semua tugas dan kegiatan Anda dalam tampilan kalender yang
                intuitif dan mudah digunakan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 border border-green-100">
              <div className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md">
                <Bell className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Notifikasi Pintar</h3>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan pengingat otomatis untuk deadline dan tugas penting
                agar tidak ada yang terlewat.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 border border-purple-100">
              <div className="bg-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Analitik Produktivitas</h3>
              <p className="text-gray-600 leading-relaxed">
                Pantau progress dan produktivitas Anda dengan grafik dan
                statistik yang detail.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 border border-red-100">
              <div className="bg-red-500 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Kolaborasi Tim</h3>
              <p className="text-gray-600 leading-relaxed">
                Bekerja sama dengan tim Anda, bagikan tugas, dan pantau progress
                bersama-sama.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 border border-teal-100">
              <div className="bg-teal-500 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cepat & Responsif</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface yang cepat dan responsif, bekerja lancar di semua
                perangkat Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">
              Cara Kerja Organizo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mulai produktif dalam 3 langkah sederhana
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Daftar Gratis</h3>
              <p className="text-gray-600 leading-relaxed">
                Buat akun Anda dalam hitungan detik. Tidak perlu kartu kredit,
                langsung mulai!
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Tambahkan Tugas</h3>
              <p className="text-gray-600 leading-relaxed">
                Mulai menambahkan tugas, atur prioritas, dan tentukan deadline
                untuk setiap tugas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Tingkatkan Produktivitas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pantau progress Anda, selesaikan tugas, dan capai tujuan Anda
                dengan lebih efisien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section id="benefits" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">
              Mengapa Memilih Organizo?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang sudah meningkatkan
              produktivitas mereka
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Benefit 1 */}
            <div className="flex gap-5 items-start">
              <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
                <TrendingUp className="text-yellow-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Tingkatkan Produktivitas 3x Lipat
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Pengguna kami melaporkan peningkatan produktivitas hingga 300%
                  setelah menggunakan Organizo selama 1 bulan.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-5 items-start">
              <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                <Shield className="text-blue-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Keamanan Terjamin</h3>
                <p className="text-gray-600 leading-relaxed">
                  Data Anda dienkripsi dan disimpan dengan aman. Privasi Anda
                  adalah prioritas kami.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-5 items-start">
              <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                <Clock className="text-green-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Hemat Waktu</h3>
                <p className="text-gray-600 leading-relaxed">
                  Otomasi pengingat dan notifikasi membantu Anda fokus pada hal
                  yang penting tanpa khawatir lupa.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-5 items-start">
              <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                <Star className="text-purple-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Rating 4.9/5</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dipercaya oleh ribuan pengguna dengan rating tertinggi di
                  kelasnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 px-6 bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="text-5xl font-extrabold mb-2">10,000+</div>
              <p className="text-lg opacity-90">Pengguna Aktif</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">500,000+</div>
              <p className="text-lg opacity-90">Tugas Diselesaikan</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">4.9/5</div>
              <p className="text-lg opacity-90">Rating Pengguna</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHART SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">
              Pantau Progress Anda
            </h2>
            <p className="text-lg text-gray-600">
              Lihat statistik produktivitas Anda dalam grafik yang mudah
              dipahami
            </p>
          </div>

          {chartData && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-xl border border-yellow-100">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        font: { size: 14, weight: "bold" },
                        color: "#374151",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      padding: 12,
                      cornerRadius: 8,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: "#6B7280",
                        font: { size: 12 },
                      },
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                      },
                    },
                    x: {
                      ticks: {
                        color: "#6B7280",
                        font: { size: 12 },
                      },
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Siap Meningkatkan Produktivitas Anda?
          </h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat
            Organizo. Mulai gratis hari ini!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition transform hover:scale-105"
          >
            Daftar Sekarang - Gratis! <ArrowRight size={24} />
          </Link>
          <p className="mt-6 text-sm opacity-75">
            Tidak perlu kartu kredit • Gratis selamanya • Setup dalam 2 menit
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {/* Column 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Organizo Logo"
                className="w-10 h-10 rounded-xl"
              />
              <div className="font-bold text-white text-lg">Organizo</div>
            </div>
            <p className="text-sm leading-relaxed">
              Platform manajemen tugas terbaik untuk meningkatkan produktivitas
              Anda.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-bold mb-4">Produk</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="hover:text-yellow-400 transition"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Harga
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-bold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Karir
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-yellow-400 transition"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-yellow-400 transition">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Kontak
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2026 Organizo Task Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
