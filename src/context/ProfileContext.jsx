import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // Profile belum ada, tunggu trigger database
        setTimeout(() => {
          fetchProfile();
        }, 2000);
        return;
      } else if (!error) {
        setProfile(data);

        if (user.app_metadata?.provider === "google") {
          await updateGoogleProfile(data);
        }
      }
    } catch (error) {
      // Silent error handling - profile akan tetap null
    } finally {
      setLoading(false);
    }
  };

  const updateGoogleProfile = async (currentProfile) => {
    try {
      const googleName =
        user.user_metadata?.full_name || user.user_metadata?.name;
      const googleAvatar = user.user_metadata?.avatar_url;

      const needsUpdate =
        (googleName && googleName !== currentProfile.full_name) ||
        (googleAvatar && googleAvatar !== currentProfile.avatar_url);

      if (needsUpdate) {
        const updatedProfile = {
          full_name: googleName || currentProfile.full_name,
          avatar_url: googleAvatar || currentProfile.avatar_url,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("profiles")
          .update(updatedProfile)
          .eq("id", user.id)
          .select()
          .single();

        if (!error) {
          setProfile(data);
        }
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      setProfile(data);
      return { data };
    } catch (error) {
      return { error };
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, loading, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
};
