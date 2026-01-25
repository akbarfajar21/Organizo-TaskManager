import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  subscribeUser,
  isOneSignalReady,
  getSubscriptionStatus,
} from "../lib/onesignal";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  // Auto-subscribe to OneSignal when user logs in
  useEffect(() => {
    let timeoutId;

    const setupOneSignal = async () => {
      if (user?.id) {
        // Wait for OneSignal to be ready
        const maxAttempts = 30; // 30 attempts * 500ms = 15 seconds
        let attempts = 0;

        while (!isOneSignalReady() && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempts++;
        }

        if (!isOneSignalReady()) {
          console.warn("OneSignal not ready for auto-subscription");
          return;
        }

        // Check if already subscribed
        const status = await getSubscriptionStatus();

        if (
          status.supported &&
          !status.subscribed &&
          status.permission === "default"
        ) {
          // Wait 3 seconds before prompting (better UX)
          timeoutId = setTimeout(async () => {
            try {
              const subscribed = await subscribeUser(user.id, user.email);

              if (subscribed) {
                console.log("User auto-subscribed to OneSignal");

                // Save subscription status to profile
                await supabase
                  .from("profiles")
                  .update({ push_notifications_enabled: true })
                  .eq("id", user.id);
              }
            } catch (error) {
              console.error("Auto-subscribe error:", error);
            }
          }, 3000);
        } else if (status.subscribed) {
          // User already subscribed, just set external ID
          const OneSignal = (await import("react-onesignal")).default;
          await OneSignal.setExternalUserId(user.id);
          console.log("OneSignal external user ID updated");
        }
      }
    };

    setupOneSignal();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
