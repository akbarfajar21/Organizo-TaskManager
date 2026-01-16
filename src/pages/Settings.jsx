import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { requestNotificationPermission } from "../notifications";
import {
  User,
  Mail,
  Camera,
  Save,
  Sparkles,
  Upload,
  X,
  Info,
  Shield,
  Key,
  Bell,
  BellOff,
} from "lucide-react";
import Swal from "sweetalert2";

export default function Settings() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarType, setAvatarType] = useState("generated");
  const [avatarStyle, setAvatarStyle] = useState("bottts");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [notificationStatus, setNotificationStatus] = useState(
    Notification.permission
  );

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!profile) return;

    setName(profile.full_name || "");
    setAvatarUrl(profile.avatar_url || null);

    if (profile.avatar_url) {
      if (
        profile.avatar_url.includes("supabase") ||
        profile.avatar_url.includes("blob:")
      ) {
        setAvatarType("uploaded");
      } else {
        setAvatarType("generated");
      }
    }
  }, [profile]);

  /* ================= GENERATE AVATAR ================= */
  const generateAvatar = () => {
    const seed = name || user.email;
    let url = "";

    switch (avatarStyle) {
      case "beam":
      case "bauhaus":
      case "ring":
      case "pixel":
      case "sunset":
      case "marble":
        url = `https://source.boringavatars.com/${avatarStyle}/120/${encodeURIComponent(
          seed
        )}?colors=FBBF24,F59E0B,D97706,B45309,92400E`;
        break;

      case "bottts":
      case "avataaars":
      case "adventurer":
      case "personas":
      case "micah":
      case "lorelei":
      case "notionists":
      case "thumbs":
        url = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(
          seed
        )}`;
        break;

      case "initials":
        url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || user.email
        )}&background=FBBF24&color=1F2937&size=200&bold=true`;
        break;
    }

    setAvatarUrl(url);
    setAvatarType("generated");
    setUploadedFile(null);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Avatar baru dibuat!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  /* ================= HANDLE FILE UPLOAD ================= */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "File Tidak Valid",
        text: "Hanya file gambar yang diperbolehkan",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: "Ukuran file maksimal 2MB",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
      setAvatarType("uploaded");
    };
    reader.readAsDataURL(file);
  };

  /* ================= UPLOAD TO SUPABASE STORAGE ================= */
  const uploadAvatarToStorage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  };

  /* ================= SAVE AVATAR ================= */
  const saveAvatar = async () => {
    if (!avatarUrl) return;

    setLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;

      if (avatarType === "uploaded" && uploadedFile) {
        finalAvatarUrl = await uploadAvatarToStorage(uploadedFile);
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: finalAvatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        avatar_url: finalAvatarUrl,
      }));

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Avatar berhasil disimpan",
        confirmButtonColor: "#FBBF24",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.message || "Terjadi kesalahan saat menyimpan avatar",
        confirmButtonColor: "#FBBF24",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Nama tidak boleh kosong",
        confirmButtonColor: "#FBBF24",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui",
        text: "Terjadi kesalahan saat memperbarui profil",
        confirmButtonColor: "#FBBF24",
        confirmButtonText: "OK",
      });
      return;
    }

    setProfile((prev) => ({
      ...prev,
      full_name: name.trim(),
    }));

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Profil berhasil diperbarui",
      confirmButtonColor: "#FBBF24",
      confirmButtonText: "OK",
      timer: 2000,
    });
  };

  /* ================= HANDLE TOGGLE NOTIFICATIONS ================= */
  const handleToggleNotifications = async () => {
    if (notificationStatus === "default") {
      const result = await requestNotificationPermission();
      setNotificationStatus(Notification.permission);

      if (result) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Notifikasi diaktifkan!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } else if (notificationStatus === "denied") {
      Swal.fire({
        icon: "info",
        title: "Notifikasi Diblokir",
        html: `
          <p class="text-sm text-gray-600 mb-3">Silakan aktifkan notifikasi di pengaturan browser:</p>
          <div class="text-left text-xs bg-gray-50 p-3 rounded-lg space-y-2">
            <p class="font-bold">Chrome/Edge:</p>
            <ol class="list-decimal ml-4 space-y-1">
              <li>Klik ikon <strong>gembok</strong> di address bar</li>
              <li>Pilih <strong>Site settings</strong></li>
              <li>Ubah Notifications → <strong>Allow</strong></li>
            </ol>
            <p class="font-bold mt-3">Firefox:</p>
            <ol class="list-decimal ml-4 space-y-1">
              <li>Klik ikon <strong>gembok</strong></li>
              <li>Klik <strong>More information</strong></li>
              <li>Tab Permissions → Centang <strong>Receive Notifications</strong></li>
            </ol>
          </div>
        `,
        confirmButtonColor: "#FBBF24",
        confirmButtonText: "Mengerti",
      });
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <User className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 truncate">
              Pengaturan Profil
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
              Kelola informasi dan preferensi akun Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ================= LEFT COLUMN - AVATAR ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="text-center mb-4 sm:mb-5">
                <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-1">
                  Foto Profil
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kustomisasi avatar Anda
                </p>
              </div>

              {/* Avatar Preview */}
              <div className="relative group mb-4 sm:mb-6 flex justify-center">
                <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 flex items-center justify-center border-4 border-yellow-400 dark:border-yellow-500 shadow-xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-bold text-yellow-600 dark:text-yellow-400">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {avatarType === "uploaded" && avatarUrl && (
                  <button
                    onClick={() => {
                      setAvatarUrl(null);
                      setUploadedFile(null);
                      setAvatarType("generated");
                    }}
                    className="absolute top-0 right-1/2 translate-x-16 sm:translate-x-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all"
                    title="Hapus foto"
                  >
                    <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                )}
              </div>

              {/* Avatar Type Tabs */}
              <div className="flex gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl mb-4 sm:mb-5">
                <button
                  onClick={() => setAvatarType("generated")}
                  className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    avatarType === "generated"
                      ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <Sparkles className="inline mr-1 sm:mr-1.5" size={14} />
                  <span className="hidden sm:inline">Generate</span>
                  <span className="sm:hidden">Gen</span>
                </button>
                <button
                  onClick={() => setAvatarType("uploaded")}
                  className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    avatarType === "uploaded"
                      ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <Upload className="inline mr-1 sm:mr-1.5" size={14} />
                  Upload
                </button>
              </div>

              {/* Avatar Controls */}
              <div className="space-y-2.5 sm:space-y-3">
                {avatarType === "generated" ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                        Gaya Avatar
                      </label>
                      <select
                        value={avatarStyle}
                        onChange={(e) => setAvatarStyle(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      >
                        <optgroup label="Boring Avatars (Modern)">
                          <option value="beam">Beam</option>
                          <option value="bauhaus">Bauhaus</option>
                          <option value="ring">Ring</option>
                          <option value="pixel">Pixel</option>
                          <option value="sunset">Sunset</option>
                          <option value="marble">Marble</option>
                        </optgroup>
                        <optgroup label="DiceBear (Cartoon)">
                          <option value="bottts">Bottts (Robot)</option>
                          <option value="avataaars">Avataaars</option>
                          <option value="adventurer">Adventurer</option>
                          <option value="personas">Personas</option>
                          <option value="micah">Micah</option>
                          <option value="lorelei">Lorelei</option>
                          <option value="notionists">Notionists</option>
                          <option value="thumbs">Thumbs</option>
                        </optgroup>
                        <optgroup label="UI Avatars (Simple)">
                          <option value="initials">Initials</option>
                        </optgroup>
                      </select>
                    </div>

                    <button
                      onClick={generateAvatar}
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Generate Avatar
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all"
                    >
                      <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Pilih Foto
                    </button>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
                      JPG, PNG, atau GIF (Max 2MB)
                    </p>
                  </>
                )}

                <button
                  onClick={saveAvatar}
                  disabled={loading || !avatarUrl}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {loading ? "Menyimpan..." : "Simpan Avatar"}
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN - PROFILE INFO ================= */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Account Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="text-white" size={14} />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100">
                  Informasi Akun
                </h3>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    <Mail size={14} className="sm:w-4 sm:h-4" />
                    Email
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium break-all">
                    {user?.email}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 sm:mt-1.5 flex items-center gap-1">
                    <Info size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* User ID */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    <Key size={14} className="sm:w-4 sm:h-4" />
                    User ID
                  </label>
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-gray-300 font-mono font-bold text-base sm:text-lg tracking-wider text-center">
                    {profile?.user_id || "Loading..."}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 sm:mt-1.5 flex items-center gap-1">
                    <Shield size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                    User ID unik Anda (tidak dapat diubah)
                  </p>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    <User size={14} className="sm:w-4 sm:h-4" />
                    Nama Lengkap
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Save size={16} className="sm:w-5 sm:h-5" />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>

            {/* ================= NOTIFICATION SETTINGS CARD ================= */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bell className="text-white" size={14} />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100">
                  Notifikasi
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {notificationStatus === "granted" ? (
                        <Bell
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                      ) : (
                        <BellOff
                          className="text-gray-400 flex-shrink-0"
                          size={16}
                        />
                      )}
                      <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                        Push Notifications
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Dapatkan pengingat untuk tugas yang akan jatuh tempo
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {notificationStatus === "granted" ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Aktif
                      </div>
                    ) : (
                      <button
                        onClick={handleToggleNotifications}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                      >
                        {notificationStatus === "denied"
                          ? "Cara Aktifkan"
                          : "Aktifkan"}
                      </button>
                    )}
                  </div>
                </div>

                {notificationStatus === "granted" && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-xs text-green-700 dark:text-green-400 flex items-start gap-2">
                      <Info size={14} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Anda akan menerima notifikasi untuk pengingat tugas 1
                        hari sebelumnya, 1 jam sebelumnya, dan saat jatuh tempo.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
