import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const fetchTimeoutRef = useRef(null);

  const fetchTotalUnread = async () => {
    if (!user?.id) {
      setTotalUnreadMessages(0);
      return;
    }

    const { data: chats } = await supabase
      .from("chats")
      .select("id, deleted_by")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (!chats || chats.length === 0) {
      setTotalUnreadMessages(0);
      return;
    }

    const chatIds = chats.map((c) => c.id);

    const { data: messages } = await supabase
      .from("messages")
      .select("chat_id, created_at, is_read, sender_id")
      .in("chat_id", chatIds)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    if (!messages) {
      setTotalUnreadMessages(0);
      return;
    }

    let totalUnread = 0;

    messages.forEach((msg) => {
      const chat = chats.find((c) => c.id === msg.chat_id);
      if (chat) {
        const deletedBy = chat.deleted_by || [];
        const userDeleted = deletedBy.find((item) => item.user_id === user.id);

        if (userDeleted && userDeleted.deleted_at) {
          const deletedTime = new Date(userDeleted.deleted_at).getTime();
          const msgTime = new Date(msg.created_at).getTime();
          if (msgTime > deletedTime) {
            totalUnread++;
          }
        } else {
          totalUnread++;
        }
      }
    });

    setTotalUnreadMessages(totalUnread);
  };

  // Debounced fetch
  const debouncedFetchTotalUnread = () => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchTotalUnread();
    }, 300);
  };

  useEffect(() => {
    fetchTotalUnread();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("chat-unread-global")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (payload.new.sender_id !== user.id) {
            debouncedFetchTotalUnread();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [user?.id]);

  return (
    <ChatContext.Provider value={{ totalUnreadMessages, fetchTotalUnread }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
