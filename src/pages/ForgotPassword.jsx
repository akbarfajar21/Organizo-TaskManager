import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Email",
        text: error.message,
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setEmailSent(true);
    Swal.fire({
      icon: "success",
      title: "Email Terkirim!",
      html: `
        <p style="color: #6B7280; margin-bottom: 8px;">Link reset password telah dikirim ke:</p>
        <p style="font-size: 16px; font-weight: bold; color: #F59E0B;">${email}</p>
        <p style="color: #6B7280; margin-top: 8px;">Silakan cek inbox atau folder spam Anda.</p>
      `,
      confirmButtonColor: "#FBBF24",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 dark:bg-yellow-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 dark:bg-orange-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali ke Login</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300 p-3">
            <img
              src="/logo.png"
              alt="Organizo Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
            Lupa Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Masukkan email Anda untuk reset password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          {!emailSent ? (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  Kami akan mengirimkan link untuk reset password ke email Anda.
                  Link tersebut berlaku selama 1 jam.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-yellow-500 transition-colors"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="nama@gmail.com"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim Email...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={20} />
                    Kirim Link Reset Password
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send
                  size={40}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Email Terkirim!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Kami telah mengirim link reset password ke{" "}
                <strong>{email}</strong>
              </p>
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
