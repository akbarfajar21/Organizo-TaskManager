import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function Landing() {
  // Simulasi data produktivitas minggu ini (7 hari terakhir)
  const [chartData, setChartData] = useState(null);

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
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-extrabold text-xl"
          >
            <img
              src="/logo.png"
              alt="Organizo Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-md"
            />
            <div className="leading-tight">
              <div>Organizo</div>
              <div className="text-xs font-normal text-gray-500">
                Task Manager
              </div>
            </div>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-8 font-medium text-gray-700">
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
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
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/80 backdrop-blur-sm text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm border border-yellow-200">
            Kelola Hidup Anda Lebih Baik
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Produktivitas Dimulai
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600">
              Dari Organizo
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Platform manajemen tugas all-in-one yang membantu Anda mengorganisir
            pekerjaan, melacak deadline, dan meningkatkan produktivitas dengan
            cara yang sederhana dan elegan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 max-w-md mx-auto">
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Mulai Gratis Sekarang <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="bg-white border border-gray-300 text-gray-800 px-8 py-3 rounded-2xl font-bold shadow hover:shadow-md transition"
            >
              Lihat Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Fitur Lengkap untuk Produktivitas Maksimal
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola tugas dan waktu dalam satu
            platform
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          <FeatureCard
            icon="📋"
            title="Manajemen Tugas"
            description="Buat, edit, dan kelola tugas dengan mudah. Tandai prioritas, set deadline, dan kategorikan tugas sesuai kebutuhan Anda."
            colorFrom="yellow-400"
            colorTo="amber-500"
          />
          <FeatureCard
            icon="📅"
            title="Kalender Interaktif"
            description="Visualisasi semua tugas Anda dalam kalender yang intuitif. Lihat jadwal harian, mingguan, dan bulanan dengan jelas."
            colorFrom="blue-400"
            colorTo="indigo-500"
          />
          <FeatureCard
            icon="🔔"
            title="Notifikasi Pintar"
            description="Dapatkan pengingat otomatis untuk deadline yang mendekat. Jangan pernah lewatkan tugas penting lagi."
            colorFrom="green-400"
            colorTo="emerald-500"
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-yellow-50 text-center max-w-7xl mx-auto"
      >
        <span className="inline-block bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          Cara Kerja
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Mulai Produktif dalam 3 Langkah
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Proses yang sederhana dan cepat untuk memulai
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Daftar Gratis"
            description="Buat akun dalam hitungan detik. Tidak perlu kartu kredit, langsung mulai menggunakan semua fitur."
          />
          <StepCard
            number="2"
            title="Tambah Tugas"
            description="Mulai menambahkan tugas Anda. Set deadline, prioritas, dan kategori untuk setiap tugas."
          />
          <StepCard
            number="3"
            title="Tingkatkan Produktivitas"
            description="Pantau progress, selesaikan tugas, dan lihat produktivitas Anda meningkat dari hari ke hari."
          />
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section
        id="benefits"
        className="py-20 px-6 bg-white max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
      >
        <div>
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            Keuntungan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Mengapa Memilih Organizo?
          </h2>
          <p className="text-gray-700 mb-10 max-w-lg leading-relaxed">
            Lebih dari sekadar to-do list. Organizo adalah partner produktivitas
            Anda yang membantu mencapai tujuan dengan lebih efisien.
          </p>
          <div className="space-y-6">
            <BenefitItem
              title="100% Gratis"
              description="Semua fitur tersedia gratis tanpa batasan. Tidak ada biaya tersembunyi."
              color="green"
            />
            <BenefitItem
              title="Aman & Privat"
              description="Data Anda terenkripsi dan aman. Kami menghargai privasi Anda."
              color="blue"
            />
            <BenefitItem
              title="Terus Berkembang"
              description="Fitur baru ditambahkan secara berkala berdasarkan feedback pengguna."
              color="purple"
            />
            <BenefitItem
              title="Hemat Waktu"
              description="Interface intuitif yang menghemat waktu Anda hingga 30% setiap hari."
              color="orange"
            />
          </div>
        </div>

        {/* Chart Produktivitas */}
        <div className="bg-yellow-50 rounded-3xl p-8 shadow-lg">
          <div
            className="bg-white rounded-xl p-6 shadow-md"
            style={{ height: 220 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Produktivitas Minggu Ini
              </h3>
              <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                +24%
              </span>
            </div>
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: {
                      beginAtZero: true,
                      grid: { color: "#f3f4f6" },
                      ticks: { stepSize: 1 },
                    },
                  },
                  maintainAspectRatio: false,
                  responsive: true,
                }}
                height={180}
              />
            ) : (
              <div className="h-44 flex items-center justify-center text-gray-400">
                Loading chart...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 py-20 px-6 text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Siap Meningkatkan <br />
          Produktivitas Anda?
        </h2>
        <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
          Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat
          Organizo. Mulai gratis hari ini!
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 px-10 py-4 rounded-xl font-extrabold text-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 mx-auto"
        >
          Daftar Gratis Sekarang <ArrowRight size={24} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Organizo Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md"
              />
              <div>
                <div className="font-bold text-lg">Organizo</div>
                <div className="text-xs text-gray-400">Task Manager</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Platform manajemen tugas yang membantu Anda lebih produktif setiap
              hari.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Produk</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={handleSmoothScroll}
                  className="hover:text-white transition"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Harga
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Perusahaan</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Kontak
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs sm:text-sm">
          © 2025 Organizo. All rights reserved. Made with ❤️ in Indonesia
        </div>
      </footer>
    </div>
  );
}

// Komponen FeatureCard
function FeatureCard({ icon, title, description, colorFrom, colorTo }) {
  return (
    <div className="bg-yellow-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition cursor-pointer">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-${colorFrom} to-${colorTo} text-white shadow-md`}
      >
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Komponen StepCard
function StepCard({ number, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition cursor-default">
      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-extrabold text-2xl mb-4 shadow-md">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Komponen BenefitItem tanpa emoji
function BenefitItem({ title, description, color }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };
  return (
    <div className="flex gap-4 items-start">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl`} />
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
