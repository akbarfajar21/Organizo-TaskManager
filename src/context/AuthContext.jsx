import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  sendUserIdToServiceWorker,
  setupServiceWorkerMessageHandler,
} from "../utils/serviceWorkerHelper";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Menggunakan getSession() yang benar
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Setup Service Worker Communication untuk Background Notifications
  useEffect(() => {
    if (user?.id) {
      // Kirim user ID ke service worker saat user login
      sendUserIdToServiceWorker(user.id);

      // Setup handler untuk service worker yang request user ID
      setupServiceWorkerMessageHandler(() => user.id);

      console.log("User ID sent to Service Worker:", user.id);
    }
  }, [user]);

  // Tambahan: Cache user data untuk offline access
  useEffect(() => {
    if (user) {
      // Simpan user data ke localStorage sebagai backup
      localStorage.setItem("organizo_user_id", user.id);
      localStorage.setItem("organizo_user_email", user.email);
    } else {
      // Clear saat logout
      localStorage.removeItem("organizo_user_id");
      localStorage.removeItem("organizo_user_email");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
