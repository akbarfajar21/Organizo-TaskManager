import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
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
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-300">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 dark:bg-yellow-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 dark:bg-orange-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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
            Buat Password Baru
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Masukkan password baru untuk akun Anda
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password Baru
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-yellow-500 transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Kekuatan Password:
                    </span>
                    <span
                      className={`text-xs font-semibold ${
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
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-yellow-500 transition-colors"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukkan ulang password"
                  className={`w-full border-2 rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle
                        size={16}
                        className="text-green-600 dark:text-green-400"
                      />
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Password cocok
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center">
                        <span className="text-red-500 text-xs font-bold">
                          ✕
                        </span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Password tidak cocok
                      </p>
                    </>
                  )}
                </div>
              )}
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
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
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
