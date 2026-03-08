import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import {
  User,
  Mail,
  Camera,
  Save,
  Upload,
  X,
  Info,
  Shield,
  Key,
  RefreshCw,
  Shuffle,
  Palette,
  CheckCircle2,
  ImagePlus,
  Bot,
  Smile,
  Sparkles,
  Wand2,
  Star,
  Zap,
  Heart,
  Crown,
} from "lucide-react";
import Swal from "sweetalert2";

/* ═══════════════════════════════════════════════════
   DICEBEAR v9 — FREE, NO API KEY
   https://api.dicebear.com/9.x/{style}/svg
═══════════════════════════════════════════════════ */

const DB = "https://api.dicebear.com/9.x";

const STYLE_CATEGORIES = [
  {
    id: "human",
    label: "Karakter Manusia",
    icon: User,
    styles: [
      { id: "toon-head", label: "Toon Head", desc: "Karakter toon realistis" },
      { id: "big-smile", label: "Big Smile", desc: "Ekspresi ceria" },
      { id: "adventurer", label: "Adventurer", desc: "Ilustrasi karakter" },
      { id: "micah", label: "Micah", desc: "Wajah modern" },
      { id: "lorelei", label: "Lorelei", desc: "Ilustrasi elegan" },
      { id: "open-peeps", label: "Open Peeps", desc: "Hand-drawn" },
      { id: "personas", label: "Personas", desc: "Profesional" },
      { id: "dylan", label: "Dylan", desc: "Gaya unik" },
      { id: "notionists", label: "Notionists", desc: "Minimalis modern" },
      { id: "glass", label: "Glass", desc: "Transparan elegan" },
    ],
  },
  {
    id: "cute",
    label: "Lucu & Imut",
    icon: Heart,
    styles: [
      { id: "miniavs", label: "Miniavs", desc: "Mini karakter" },
      { id: "fun-emoji", label: "Fun Emoji", desc: "Ekspresi lucu" },
      { id: "croodles", label: "Croodles", desc: "Doodle gemas" },
      { id: "croodles-neutral", label: "Croodles Neu", desc: "Doodle netral" },
      { id: "pixel-art", label: "Pixel Art", desc: "Retro pixel" },
      { id: "pixel-art-neutral", label: "Pixel Neu", desc: "Pixel simpel" },
      { id: "rings", label: "Rings", desc: "Cincin abstrak" },
      { id: "shapes", label: "Shapes", desc: "Bentuk geometris" },
    ],
  },
  {
    id: "fantasy",
    label: "Fantasi & Unik",
    icon: Sparkles,
    styles: [
      { id: "avataaars", label: "Avataaars", desc: "Karakter animasi" },
      { id: "avataaars-neutral", label: "Avataaars Neu", desc: "Versi netral" },
      { id: "bottts", label: "Bottts", desc: "Robot klasik" },
      { id: "bottts-neutral", label: "Bottts Neu", desc: "Robot minimalis" },
      { id: "thumbs", label: "Thumbs", desc: "Thumbs up style" },
      { id: "initials", label: "Initials", desc: "Inisial nama" },
      { id: "identicon", label: "Identicon", desc: "Pola unik" },
      { id: "icons", label: "Icons", desc: "Ikon simbolik" },
    ],
  },
  {
    id: "abstract",
    label: "Abstrak",
    icon: Zap,
    styles: [
      { id: "marble", label: "Marble", desc: "Tekstur marmer" },
      { id: "bauhaus", label: "Bauhaus", desc: "Desain bauhaus" },
      { id: "sunset", label: "Sunset", desc: "Gradien matahari" },
      { id: "beam", label: "Beam", desc: "Sinar abstrak" },
      { id: "rings", label: "Rings", desc: "Lingkaran berlapis" },
    ],
  },
];

const ALL_STYLES = STYLE_CATEGORIES.flatMap((c) => c.styles);

const BG_COLORS = [
  { label: "Biru Langit", value: "b6e3f4", hex: "#b6e3f4" },
  { label: "Peach Lembut", value: "ffd5dc", hex: "#ffd5dc" },
  { label: "Hijau Mint", value: "c0efdc", hex: "#c0efdc" },
  { label: "Lavender", value: "d1d5fb", hex: "#d1d5fb" },
  { label: "Kuning Pastel", value: "fef3c7", hex: "#fef3c7" },
  { label: "Salmon", value: "fecaca", hex: "#fecaca" },
  { label: "Teal Muda", value: "99f6e4", hex: "#99f6e4" },
  { label: "Ungu Muda", value: "e9d5ff", hex: "#e9d5ff" },
  { label: "Abu Biru", value: "cbd5e1", hex: "#cbd5e1" },
  { label: "Krem", value: "fef9c3", hex: "#fef9c3" },
  { label: "Slate Gelap", value: "1e293b", hex: "#1e293b" },
  { label: "Hitam", value: "0f172a", hex: "#0f172a" },
];

const buildUrl = (style, seed, bg) =>
  `${DB}/${style}/svg?seed=${encodeURIComponent(seed)}&size=200` +
  (bg ? `&backgroundColor=${bg}&backgroundType=solid` : "");

/* ═══════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════ */
export default function Settings() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarType, setAvatarType] = useState("generated");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // generator
  const [activeCategory, setActiveCategory] = useState("human");
  const [selectedStyle, setSelectedStyle] = useState("toon-head");
  const [seed, setSeed] = useState("");
  const [bgColor, setBgColor] = useState("b6e3f4");
  const [isGenerating, setIsGenerating] = useState(false);

  /* load profile */
  useEffect(() => {
    if (!profile) return;
    const n = profile.full_name || "";
    setName(n);
    setSeed(n || user?.email || "");
    setAvatarUrl(profile.avatar_url || null);
    if (profile.avatar_url) {
      setAvatarType(
        profile.avatar_url.includes("supabase") ||
          profile.avatar_url.includes("blob:")
          ? "uploaded"
          : "generated",
      );
    }
  }, [profile]);

  useEffect(() => {
    document.title = "Organizo - Pengaturan";
  }, []);

  /* helpers */
  const currentStyles =
    STYLE_CATEGORIES.find((c) => c.id === activeCategory)?.styles || [];
  const styleInfo = ALL_STYLES.find((s) => s.id === selectedStyle);

  const applyPreview = (style, bg) => {
    const s = seed || name || user?.email || "user";
    setAvatarUrl(buildUrl(style, s, bg));
    setAvatarType("generated");
    setUploadedFile(null);
  };

  const pickStyle = (id) => {
    setSelectedStyle(id);
    applyPreview(id, bgColor);
  };
  const pickBg = (v) => {
    setBgColor(v);
    applyPreview(selectedStyle, v);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const s = seed || name || user?.email || "user";
    const rnd = s + "_" + Math.random().toString(36).slice(2, 7);
    setTimeout(() => {
      setAvatarUrl(buildUrl(selectedStyle, rnd, bgColor));
      setAvatarType("generated");
      setUploadedFile(null);
      setIsGenerating(false);
    }, 280);
  };

  const handleShuffle = () => {
    const all = ALL_STYLES;
    const pick = all[Math.floor(Math.random() * all.length)];
    const rnd =
      (seed || name || user?.email || "user") +
      "_" +
      Math.random().toString(36).slice(2, 7);
    setSelectedStyle(pick.id);
    const cat = STYLE_CATEGORIES.find((c) =>
      c.styles.some((s) => s.id === pick.id),
    );
    if (cat) setActiveCategory(cat.id);
    setIsGenerating(true);
    setTimeout(() => {
      setAvatarUrl(buildUrl(pick.id, rnd, bgColor));
      setAvatarType("generated");
      setUploadedFile(null);
      setIsGenerating(false);
    }, 280);
  };

  /* upload */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert2("error", "File Tidak Valid", "Hanya file gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert2("error", "File Terlalu Besar", "Maksimal 2MB");
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

  const uploadToStorage = async (file) => {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { cacheControl: "3600", upsert: true });
    if (error) throw error;
    return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  };

  const saveAvatar = async () => {
    if (!avatarUrl) return;
    setLoading(true);
    try {
      let url = avatarUrl;
      if (avatarType === "uploaded" && uploadedFile)
        url = await uploadToStorage(uploadedFile);
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);
      if (error) throw error;
      setProfile((p) => ({ ...p, avatar_url: url }));
      alert2("success", "Berhasil!", "Avatar berhasil disimpan");
    } catch (err) {
      alert2("error", "Gagal", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!name.trim()) {
      alert2("warning", "Perhatian", "Nama tidak boleh kosong");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      alert2("error", "Gagal", "Terjadi kesalahan");
      return;
    }
    setProfile((p) => ({ ...p, full_name: name.trim() }));
    alert2("success", "Berhasil!", "Profil berhasil diperbarui");
  };

  const alert2 = (icon, title, text) =>
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#FBBF24",
      confirmButtonText: "OK",
      ...(icon === "success" ? { timer: 2000, showConfirmButton: false } : {}),
    });

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shrink-0">
            <User className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Pengaturan Profil
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Kelola informasi dan preferensi akun Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
          {/* ══════════ LEFT PANEL ══════════ */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* Avatar card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Preview strip */}
              <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 px-6 pt-8 pb-6 flex flex-col items-center gap-3">
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle,white 1px,transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative">
                  {/* glow */}
                  <div
                    className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 bg-yellow-400/20 ${isGenerating ? "scale-150 opacity-60" : "scale-110 opacity-25"}`}
                  />
                  {/* avatar */}
                  <div
                    className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[2.5px] border-white/15 shadow-2xl transition-all duration-300 ${isGenerating ? "opacity-25 scale-90" : "opacity-100 scale-100"}`}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {user?.email?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                    </div>
                  )}
                  {avatarType === "uploaded" && avatarUrl && (
                    <button
                      onClick={() => {
                        setAvatarUrl(null);
                        setUploadedFile(null);
                        setAvatarType("generated");
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg z-10 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>

                {/* style pill */}
                {avatarType === "generated" && styleInfo && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                    <Wand2 size={10} className="text-yellow-400" />
                    <span className="text-[10px] text-white/80 font-medium tracking-wide">
                      {styleInfo.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Tab: Generate / Upload */}
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 gap-1">
                  {[
                    { id: "generated", label: "Generate", icon: Wand2 },
                    { id: "uploaded", label: "Upload", icon: ImagePlus },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setAvatarType(id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        avatarType === id
                          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate controls */}
              {avatarType === "generated" && (
                <div className="p-4 space-y-4">
                  {/* Category tabs */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Kategori
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                      {STYLE_CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setActiveCategory(id)}
                          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-center transition-all ${
                            activeCategory === id
                              ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                              : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <Icon size={14} />
                          <span className="text-[9px] font-semibold leading-tight">
                            {label.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style grid */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Pilih Gaya ({currentStyles.length} tersedia)
                    </p>
                    <div
                      className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto pr-0.5
                      scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600"
                    >
                      {currentStyles.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => pickStyle(s.id)}
                          title={s.desc}
                          className={`relative flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 transition-all group ${
                            selectedStyle === s.id
                              ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-sm"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          {/* mini avatar preview */}
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                            <img
                              src={`${DB}/${s.id}/svg?seed=sample&size=48&backgroundColor=b6e3f4&backgroundType=solid`}
                              alt={s.label}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentNode.classList.add(
                                  "flex",
                                  "items-center",
                                  "justify-center",
                                );
                                e.target.parentNode.innerHTML = `<span class='text-xs text-gray-400'>${s.label[0]}</span>`;
                              }}
                            />
                          </div>
                          <span
                            className={`text-[8.5px] font-semibold text-center leading-tight w-full truncate ${
                              selectedStyle === s.id
                                ? "text-yellow-700 dark:text-yellow-300"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {s.label}
                          </span>
                          {selectedStyle === s.id && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow">
                              <CheckCircle2 size={10} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background color */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Warna Background
                    </p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {BG_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => pickBg(c.value)}
                          title={c.label}
                          className={`h-7 rounded-lg border-2 transition-all ${
                            bgColor === c.value
                              ? "border-yellow-400 scale-110 shadow-md ring-2 ring-yellow-200 dark:ring-yellow-900"
                              : "border-transparent hover:border-gray-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Seed + actions */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
                      Seed / Variasi
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="nama atau teks..."
                        className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        title="Generate variasi baru"
                        className="w-9 h-9 shrink-0 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                      >
                        <RefreshCw
                          size={13}
                          className={isGenerating ? "animate-spin" : ""}
                        />
                      </button>
                      <button
                        onClick={handleShuffle}
                        disabled={isGenerating}
                        title="Acak style & variasi"
                        className="w-9 h-9 shrink-0 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-700 dark:text-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Shuffle size={13} />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                      Tekan <RefreshCw size={9} className="inline" /> untuk
                      variasi baru · <Shuffle size={9} className="inline" />{" "}
                      acak semua
                    </p>
                  </div>
                </div>
              )}

              {/* Upload controls */}
              {avatarType === "uploaded" && (
                <div className="p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-500 bg-gray-50 dark:bg-gray-700/40 hover:bg-yellow-50/60 dark:hover:bg-yellow-900/10 rounded-xl py-6 flex flex-col items-center gap-2.5 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-600 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 flex items-center justify-center transition-colors">
                      <Upload
                        size={18}
                        className="text-gray-400 group-hover:text-yellow-500 transition-colors"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                        Klik untuk pilih foto
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        JPG, PNG, GIF — maks 2MB
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Save avatar */}
              <div className="px-4 pb-4">
                <button
                  onClick={saveAvatar}
                  disabled={loading || !avatarUrl}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-200 dark:disabled:from-gray-700 disabled:to-gray-300 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all"
                >
                  <Camera size={13} />
                  {loading ? "Menyimpan..." : "Simpan Avatar"}
                </button>
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT PANEL ══════════ */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 sm:p-6">
              {/* Card header */}
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                  <User className="text-white" size={14} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    Informasi Akun
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Data profil Anda
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    <Mail size={12} />
                    Email
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate flex-1">
                      {user?.email}
                    </span>
                    <div className="shrink-0 flex items-center gap-1 text-[10px] text-gray-400">
                      <Shield size={10} />
                      <span>Terkunci</span>
                    </div>
                  </div>
                  <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5">
                    <Info size={9} />
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* User ID */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    <Key size={12} />
                    User ID
                  </label>
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
                    <p className="text-center font-mono font-bold text-lg sm:text-xl text-gray-700 dark:text-gray-200 tracking-widest">
                      {profile?.user_id || "—"}
                    </p>
                  </div>
                  <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5">
                    <Shield size={9} />
                    ID unik Anda, tidak dapat diubah
                  </p>
                </div>

                {/* Full name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    <User size={12} />
                    Nama Lengkap
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Save profile */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all"
                >
                  <Save size={14} />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
