import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import {
  User,
  Mail,
  Camera,
  Save,
  Sparkles,
  Upload,
  X,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";

export default function Settings() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarType, setAvatarType] = useState("generated"); // 'generated' or 'uploaded'
  const [avatarStyle, setAvatarStyle] = useState("bottts");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!profile) return;

    setName(profile.full_name || "");
    setAvatarUrl(profile.avatar_url || null);

    // Detect avatar type
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

    // Boring Avatars - Modern & Beautiful
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

      // DiceBear - More variety
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

      // UI Avatars - Simple text-based
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

    // Validasi file
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
      // 2MB
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: "Ukuran file maksimal 2MB",
        confirmButtonColor: "#FBBF24",
      });
      return;
    }

    setUploadedFile(file);

    // Preview
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

      // Jika uploaded file, upload ke Supabase Storage
      if (avatarType === "uploaded" && uploadedFile) {
        finalAvatarUrl = await uploadAvatarToStorage(uploadedFile);
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: finalAvatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      // UPDATE GLOBAL CONTEXT
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

    // UPDATE CONTEXT
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

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Pengaturan Profil
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Kelola informasi dan preferensi akun Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT COLUMN - AVATAR ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="text-center mb-5">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Foto Profil
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kustomisasi avatar Anda
                </p>
              </div>

              {/* Avatar Preview */}
              <div className="relative group mb-6 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 flex items-center justify-center border-4 border-yellow-400 dark:border-yellow-500 shadow-xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-yellow-600 dark:text-yellow-400">
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
                    className="absolute top-0 right-1/2 translate-x-20 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all"
                    title="Hapus foto"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Avatar Type Tabs */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl mb-5">
                <button
                  onClick={() => setAvatarType("generated")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    avatarType === "generated"
                      ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <Sparkles className="inline mr-1.5" size={16} />
                  Generate
                </button>
                <button
                  onClick={() => setAvatarType("uploaded")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    avatarType === "uploaded"
                      ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <Upload className="inline mr-1.5" size={16} />
                  Upload
                </button>
              </div>

              {/* Avatar Controls */}
              <div className="space-y-3">
                {avatarType === "generated" ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Gaya Avatar
                      </label>
                      <select
                        value={avatarStyle}
                        onChange={(e) => setAvatarStyle(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
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
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-5 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <Sparkles size={18} />
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
                      className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-5 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all"
                    >
                      <Upload size={18} />
                      Pilih Foto
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      JPG, PNG, atau GIF (Max 2MB)
                    </p>
                  </>
                )}

                <button
                  onClick={saveAvatar}
                  disabled={loading || !avatarUrl}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Camera size={18} />
                  {loading ? "Menyimpan..." : "Simpan Avatar"}
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN - PROFILE INFO ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  Informasi Akun
                </h3>
              </div>

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                    <Info size={12} />
                    Email tidak dapat diubah
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <User size={16} />
                    User ID
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-300 font-mono font-bold text-lg tracking-wider">
                    {profile?.user_id || "Loading..."}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                    <Info size={12} />
                    User ID unik Anda (tidak dapat diubah)
                  </p>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <User size={16} />
                    Nama Lengkap
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Save size={20} />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <Info className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">
                    Tentang Avatar
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Pilih antara avatar yang di-generate otomatis atau upload
                    foto sendiri. Avatar generated menggunakan{" "}
                    <span className="font-semibold">Boring Avatars</span> &{" "}
                    <span className="font-semibold">DiceBear API</span> dengan
                    berbagai gaya modern dan menarik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
