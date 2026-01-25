// src/hooks/useUnreadNotifications.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export const useUnreadNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!user?.id) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setUnreadCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnreadCount();

    // Realtime subscription untuk update badge
    if (!user?.id) return;

    const channel = supabase
      .channel(`badge-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadCount();
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return { unreadCount, loading, refresh: fetchUnreadCount };
};
