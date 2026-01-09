import React, { useState } from "react";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Settings,
  Lock,
  Smartphone,
  Calendar,
  Globe,
} from "lucide-react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Bagaimana cara melakukan reset password?",
      answer:
        'Anda dapat menggunakan fitur "Lupa Password" pada halaman login. Sistem akan mengirimkan email berisi tautan untuk mereset password Anda. Pastikan email yang Anda gunakan masih aktif dan periksa folder spam jika email tidak masuk.',
      icon: Lock,
    },
    {
      question: "Bisakah saya mengubah tema aplikasi?",
      answer:
        "Ya, Organizo menyediakan pilihan mode terang dan gelap. Anda dapat mengganti tema melalui tombol toggle di sidebar. Tema yang Anda pilih akan tersimpan secara otomatis dan diterapkan setiap kali Anda login.",
      icon: Settings,
    },
    {
      question: "Apakah data saya aman di Organizo?",
      answer:
        "Kami sangat menjaga keamanan data Anda dengan menerapkan enkripsi end-to-end dan protokol keamanan terkini. Data Anda disimpan di server yang aman dan hanya dapat diakses oleh Anda. Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa izin Anda.",
      icon: Lock,
    },
    {
      question: "Bagaimana cara menambahkan tugas atau kegiatan baru?",
      answer:
        'Anda dapat menambahkan tugas melalui menu "Tugas Saya" dengan mengklik tombol "Tambah Tugas". Untuk kegiatan, buka menu "Kegiatan" dan klik "Tambah Kegiatan". Isi formulir yang tersedia dengan detail yang diperlukan seperti judul, deskripsi, tanggal, dan kategori.',
      icon: CheckCircle,
    },
    {
      question: "Bisakah saya menghapus atau mengedit tugas dan kegiatan?",
      answer:
        "Ya, Anda dapat mengedit atau menghapus tugas dan kegiatan kapan saja. Pada setiap item tugas/kegiatan, terdapat tombol edit (ikon pensil) dan hapus (ikon tempat sampah). Klik tombol tersebut untuk melakukan perubahan atau penghapusan.",
      icon: Settings,
    },
    {
      question: "Apakah Organizo tersedia di mobile?",
      answer:
        "Ya, Organizo dirancang dengan responsive design sehingga dapat diakses dengan sempurna di berbagai perangkat termasuk smartphone dan tablet. Anda dapat mengakses Organizo melalui browser mobile Anda tanpa perlu mengunduh aplikasi tambahan.",
      icon: Smartphone,
    },
    {
      question: "Bagaimana cara menggunakan fitur kategori?",
      answer:
        'Kategori membantu Anda mengelompokkan tugas berdasarkan konteks seperti "Pekerjaan", "Pribadi", atau "Kuliah". Buat kategori di menu "Kategori", lalu saat menambahkan tugas baru, pilih kategori yang sesuai dari dropdown. Ini memudahkan Anda untuk memfilter dan fokus pada tugas tertentu.',
      icon: CheckCircle,
    },
    {
      question: "Bagaimana cara menggunakan fitur notifikasi?",
      answer:
        "Organizo akan mengirimkan notifikasi otomatis untuk mengingatkan Anda tentang tugas yang akan deadline atau sudah terlambat. Anda dapat melihat semua notifikasi di menu Notifikasi dan menandainya sebagai sudah dibaca atau menghapusnya.",
      icon: AlertCircle,
    },
  ];

  const guides = [
    {
      title: "Mengelola Tugas",
      description:
        "Gunakan menu Tugas Saya untuk melihat, menambah, dan mengelola tugas harian Anda secara efisien.",
      icon: CheckCircle,
      color: "blue",
    },
    {
      title: "Mencatat Kegiatan",
      description:
        "Di bagian Kegiatan, catat dan pantau aktivitas penting yang Anda lakukan setiap hari.",
      icon: Calendar,
      color: "green",
    },
    {
      title: "Memantau Notifikasi",
      description:
        "Periksa Notifikasi secara rutin untuk mendapatkan update terbaru dan pengingat penting.",
      icon: AlertCircle,
      color: "yellow",
    },
    {
      title: "Mengatur Preferensi",
      description:
        "Atur preferensi aplikasi dan informasi akun Anda melalui halaman Pengaturan.",
      icon: Settings,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-lg mb-4">
            <HelpCircle className="text-white" size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Pusat Bantuan
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda dan pelajari cara
            memaksimalkan penggunaan Organizo
          </p>
        </div>

        {/* Quick Guide Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Book className="text-yellow-600 dark:text-yellow-400" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Panduan Cepat
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {guides.map((guide, index) => (
              <GuideCard key={index} {...guide} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <MessageCircle
              className="text-yellow-600 dark:text-yellow-400"
              size={20}
            />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaq === index}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-yellow-200 dark:border-yellow-800 shadow-lg">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Mail className="text-yellow-600 dark:text-yellow-400" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Hubungi Support
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
            Jika Anda mengalami kendala, memiliki pertanyaan lebih lanjut, atau
            membutuhkan bantuan teknis, jangan ragu untuk menghubungi tim
            support kami:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ContactCard
              icon={Mail}
              title="Email"
              content="support@organizo.com"
              link="mailto:support@organizo.com"
            />
            <ContactCard
              icon={Phone}
              title="Telepon"
              content="+62 853-1377-2281"
              link="tel:+6285313772281"
            />
            <ContactCard
              icon={Clock}
              title="Waktu Layanan"
              content="Senin - Jumat, 08.00 - 17.00 WIB"
            />
            <ContactCard
              icon={Globe}
              title="Website"
              content="www.organizo.com"
              link="https://organizo.com"
            />
          </div>
        </section>

        {/* Additional Resources */}
        <section className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-md">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            Sumber Daya Tambahan
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <ResourceLink
              title="Dokumentasi Lengkap"
              description="Pelajari semua fitur Organizo secara detail"
              link="#"
            />
            <ResourceLink
              title="Video Tutorial"
              description="Tonton panduan video step-by-step"
              link="#"
            />
            <ResourceLink
              title="Blog & Tips"
              description="Dapatkan tips produktivitas dan update terbaru"
              link="#"
            />
            <ResourceLink
              title="Komunitas Pengguna"
              description="Bergabung dengan komunitas dan berbagi pengalaman"
              link="#"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ===== GUIDE CARD COMPONENT ===== */
function GuideCard({ title, description, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-400 to-amber-500",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="text-white" size={20} />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ===== FAQ ITEM COMPONENT ===== */
function FaqItem({ faq, index, isOpen, onToggle }) {
  const Icon = faq.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
          <Icon className="text-yellow-600 dark:text-yellow-400" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {faq.question}
          </h3>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="text-gray-400 dark:text-gray-500" size={18} />
          ) : (
            <ChevronDown
              className="text-gray-400 dark:text-gray-500"
              size={18}
            />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          <div className="pl-11 sm:pl-13">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== CONTACT CARD COMPONENT ===== */
function ContactCard({ icon: Icon, title, content, link }) {
  const CardContent = (
    <>
      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-200 dark:bg-yellow-800/40 flex items-center justify-center flex-shrink-0">
          <Icon className="text-yellow-700 dark:text-yellow-400" size={16} />
        </div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h4>
      </div>
      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pl-10 sm:pl-13 break-words">
        {content}
      </p>
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        className="block bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-all hover:border-yellow-400 dark:hover:border-yellow-600"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200 dark:border-yellow-800">
      {CardContent}
    </div>
  );
}

/* ===== RESOURCE LINK COMPONENT ===== */
function ResourceLink({ title, description, link }) {
  return (
    <a
      href={link}
      className="flex items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
    >
      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-400 mt-1.5 sm:mt-2 group-hover:scale-125 transition-transform"></div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
          {title}
        </h4>
        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <ChevronDown
        className="text-gray-400 dark:text-gray-500 transform -rotate-90 group-hover:translate-x-1 transition-transform flex-shrink-0"
        size={14}
      />
    </a>
  );
}
