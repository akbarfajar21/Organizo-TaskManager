// src/pages/HelpPage.jsx
import React from "react";

export default function HelpPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Bantuan & FAQ
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Panduan Penggunaan Aplikasi
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Selamat datang di Organizo! Berikut panduan singkat untuk membantu
          Anda memulai dan memaksimalkan penggunaan aplikasi:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            Gunakan menu <strong>"Tugas Saya"</strong> untuk melihat, menambah,
            dan mengelola tugas harian Anda secara efisien.
          </li>
          <li>
            Di bagian <strong>"Kegiatan"</strong>, catat dan pantau aktivitas
            penting yang Anda lakukan setiap hari.
          </li>
          <li>
            Periksa <strong>"Notifikasi"</strong> secara rutin untuk mendapatkan
            update terbaru dan pengingat penting.
          </li>
          <li>
            Atur preferensi aplikasi dan informasi akun Anda melalui halaman{" "}
            <strong>"Pengaturan"</strong>.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>
        <dl className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold">
              Bagaimana cara melakukan reset password?
            </dt>
            <dd className="mt-1">
              Anda dapat menggunakan fitur <em>"Lupa Password"</em> pada halaman
              login. Sistem akan mengirimkan email berisi tautan untuk mereset
              password Anda.
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Bisakah saya mengubah tema aplikasi?
            </dt>
            <dd className="mt-1">
              Ya, Organizo menyediakan pilihan mode terang dan gelap. Anda dapat
              mengganti tema melalui menu pengaturan di sidebar sesuai
              preferensi Anda.
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Apakah data saya aman di Organizo?
            </dt>
            <dd className="mt-1">
              Kami sangat menjaga keamanan data Anda dengan menerapkan enkripsi
              dan protokol keamanan terkini untuk melindungi informasi pribadi
              dan aktivitas Anda.
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Bagaimana cara menambahkan tugas atau kegiatan baru?
            </dt>
            <dd className="mt-1">
              Anda dapat menambahkan tugas melalui menu{" "}
              <strong>"Tugas Saya"</strong> dan kegiatan melalui menu{" "}
              <strong>"Kegiatan"</strong> dengan mengisi formulir yang tersedia.
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Bisakah saya menghapus atau mengedit tugas dan kegiatan?
            </dt>
            <dd className="mt-1">
              Ya, Anda dapat mengedit atau menghapus tugas dan kegiatan kapan
              saja melalui halaman masing-masing dengan menggunakan tombol edit
              atau hapus.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Kontak Support</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Jika Anda mengalami kendala, memiliki pertanyaan lebih lanjut, atau
          membutuhkan bantuan teknis, jangan ragu untuk menghubungi tim support
          kami:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            Email:{" "}
            <a
              href="mailto:support@organizo.com"
              className="text-yellow-500 hover:underline"
            >
              support@organizo.com
            </a>
          </li>
          <li>Telepon: +62 853-1377-2281</li>
          <li>Waktu Layanan: Senin - Jumat, 08.00 - 17.00 WIB</li>
        </ul>
      </section>
    </div>
  );
}
