import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Check if user came from reset password email
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Link Tidak Valid",
          text: "Link reset password tidak valid atau sudah kedaluwarsa",
          confirmButtonColor: "#FBBF24",
        }).then(() => {
          navigate("/login");
        });
      }
    });
  }, [navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password Terlalu Pendek",
        text: "Password minimal 6 karakter",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password harus sama",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Reset Password",
        text: error.message,
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    // ✅ LOGOUT USER SETELAH BERHASIL RESET PASSWORD
    await supabase.auth.signOut();

    Swal.fire({
      icon: "success",
      title: "Password Berhasil Diubah!",
      text: "Silakan login dengan password baru Anda",
      confirmButtonColor: "#FBBF24",
      confirmButtonText: "Login Sekarang",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login", { replace: true });
      }
    });
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 33, label: "Lemah", color: "bg-red-500" };
    if (strength <= 3)
      return { strength: 66, label: "Sedang", color: "bg-yellow-500" };
    return { strength: 100, label: "Kuat", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-3"></div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Memverifikasi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-4 relative overflow-hidden">
      {/* Animated Background - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-yellow-200 dark:bg-yellow-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-orange-200 dark:bg-orange-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-amber-200 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300 p-2.5 sm:p-3">
            <img
              src="/logo.png"
              alt="Organizo Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 tracking-tight px-4">
            Buat Password Baru
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 px-4">
            Masukkan password baru untuk akun Anda
          </p>
        </div>

        {/* Form Card - Responsive */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-5 sm:p-6 lg:p-8">
          <form
            onSubmit={handleResetPassword}
            className="space-y-4 sm:space-y-5"
          >
            {/* Password - Responsive */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Password Baru
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-yellow-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength - Responsive */}
              {password && (
                <div className="mt-1.5 sm:mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                      Kekuatan Password:
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        passwordStrength.label === "Lemah"
                          ? "text-red-600 dark:text-red-400"
                          : passwordStrength.label === "Sedang"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password - Responsive */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Konfirmasi Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-yellow-500 transition-colors"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukkan ulang password"
                  className={`w-full border-2 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 dark:border-red-700 focus:ring-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : confirmPassword && password === confirmPassword
                      ? "border-green-300 dark:border-green-700 focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "border-gray-200 dark:border-gray-600 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle
                        size={14}
                        className="sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0"
                      />
                      <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
                        Password cocok
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                        <X
                          size={10}
                          className="sm:w-2.5 sm:h-2.5 text-red-500"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">
                        Password tidak cocok
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button - Responsive */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  Simpan Password Baru
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
