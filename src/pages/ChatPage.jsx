// src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

// Import components
import ChatSidebar from "../components/chats/ChatSidebar";
import ChatHeader from "../components/chats/ChatHeader";
import MessageList from "../components/chats/MessageList";
import ChatInput from "../components/chats/ChatInput";
import TaskActivityModal from "../components/chats/TaskActivityModal";
import UserProfileModal from "../components/chats/UserProfileModal";
import Swal from "sweetalert2";

export default function ChatPage() {
  const { user } = useAuth();

  // State utama
  const [users, setUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [chatId, setChatId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const { fetchTotalUnread } = useChat();

  const [showChatRoom, setShowChatRoom] = useState(false);

  const [isLoadingChats, setIsLoadingChats] = useState(true); // Loading untuk recent chats
  const [isLoadingSearch, setIsLoadingSearch] = useState(false); // Loading untuk search

  // Modal tugas/kegiatan
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // Modal profil user
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Dropdown menu untuk setiap pesan
  const [openDropdown, setOpenDropdown] = useState(null);

  // Dropdown menu untuk sidebar chat (hapus chat)
  const [openChatDropdown, setOpenChatDropdown] = useState(null);

  const messagesEndRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click originates from inside any dropdown container
      if (!event.target.closest('[data-dropdown="true"]')) {
        setOpenDropdown(null);
        setOpenChatDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.title = "Organizo - Chat";
  }, []);

  // --- Fetch semua user kecuali diri sendiri ---
  useEffect(() => {
    if (!user?.id) return;

    const fetchUsers = async () => {
      // Cek apakah search sedang dilakukan
      if (search.trim() !== "") {
        setIsLoadingSearch(true); // ✅ Set loading untuk search
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, user_id")
        .neq("id", user.id);

      if (error) {
        // Handle error
      } else {
        setUsers(data || []);
      }

      setIsLoadingSearch(false); // ✅ Set loading false setelah selesai
    };

    fetchUsers();
  }, [user?.id, search]);

  // --- Fetch recent chats dan unread counts ---
  const fetchRecentChatsWithUnread = async () => {
    if (!user?.id) return;

    setIsLoadingChats(true); // ✅ Set loading true sebelum fetch

    const { data: chats, error: chatError } = await supabase
      .from("chats")
      .select("id, user1_id, user2_id, deleted_by")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (chatError || !chats || chats.length === 0) {
      setRecentChats([]);
      setUnreadCounts({});
      setTotalUnreadMessages(0);
      setIsLoadingChats(false); // ✅ Set loading false setelah selesai
      return;
    }

    const activeChats = chats.filter((chat) => {
      const deletedBy = chat.deleted_by || [];
      const userDeleted = deletedBy.find((item) => item.user_id === user.id);
      if (!userDeleted) return true;
      return true;
    });

    if (activeChats.length === 0) {
      setRecentChats([]);
      setUnreadCounts({});
      setTotalUnreadMessages(0);
      setIsLoadingChats(false); // ✅ Set loading false setelah selesai
      return;
    }

    const chatIds = activeChats.map((c) => c.id);

    const { data: messagesData, error: msgError } = await supabase
      .from("messages")
      .select("chat_id, created_at, is_read, sender_id, content, type")
      .in("chat_id", chatIds);

    if (msgError || !messagesData) {
      setRecentChats([]);
      setUnreadCounts({});
      setTotalUnreadMessages(0);
      setIsLoadingChats(false); // ✅ Set loading false setelah selesai
      return;
    }

    const chatsWithRecentMessages = activeChats.filter((chat) => {
      const deletedBy = chat.deleted_by || [];
      const userDeleted = deletedBy.find((item) => item.user_id === user.id);
      const chatMessages = messagesData.filter((m) => m.chat_id === chat.id);
      if (chatMessages.length === 0) return false;

      if (userDeleted && userDeleted.deleted_at) {
        const deletedTime = new Date(userDeleted.deleted_at).getTime();
        const hasNewMessages = chatMessages.some((msg) => {
          const msgTime = new Date(msg.created_at).getTime();
          return msgTime > deletedTime;
        });
        return hasNewMessages;
      }

      return true;
    });

    if (chatsWithRecentMessages.length === 0) {
      setRecentChats([]);
      setUnreadCounts({});
      setTotalUnreadMessages(0);
      setIsLoadingChats(false); // ✅ Set loading false setelah selesai
      return;
    }

    const userIds = chatsWithRecentMessages
      .map((c) => (c.user1_id === user.id ? c.user2_id : c.user1_id))
      .filter((v, i, a) => a.indexOf(v) === i);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id,full_name,avatar_url,user_id")
      .in("id", userIds);

    const safeProfiles = profiles || [];

    const counts = {};
    let totalUnread = 0;

    messagesData.forEach((msg) => {
      if (!msg.is_read && msg.sender_id !== user.id) {
        const chat = chatsWithRecentMessages.find((c) => c.id === msg.chat_id);
        if (chat) {
          const deletedBy = chat.deleted_by || [];
          const userDeleted = deletedBy.find(
            (item) => item.user_id === user.id,
          );

          if (userDeleted && userDeleted.deleted_at) {
            const deletedTime = new Date(userDeleted.deleted_at).getTime();
            const msgTime = new Date(msg.created_at).getTime();
            if (msgTime > deletedTime) {
              counts[msg.chat_id] = (counts[msg.chat_id] || 0) + 1;
              totalUnread++;
            }
          } else {
            counts[msg.chat_id] = (counts[msg.chat_id] || 0) + 1;
            totalUnread++;
          }
        }
      }
    });

    setUnreadCounts(counts);
    setTotalUnreadMessages(totalUnread);

    const times = {};
    const lastMessages = {}; // Untuk menyimpan pesan terbaru per chat

    messagesData.forEach((msg) => {
      const msgTime = new Date(msg.created_at).getTime();
      if (!times[msg.chat_id] || times[msg.chat_id] < msgTime) {
        times[msg.chat_id] = msgTime;
        lastMessages[msg.chat_id] = msg; // Simpan object pesan terbarunya
      }
    });

    const recent = chatsWithRecentMessages.map((c) => {
      const otherUser =
        safeProfiles.find(
          (p) => p.id === (c.user1_id === user.id ? c.user2_id : c.user1_id),
        ) || {};

      const lastMsg = lastMessages[c.id];

      return {
        chat_id: c.id,
        ...otherUser,
        last_message: lastMsg ? lastMsg.content : "",
        last_message_type: lastMsg ? lastMsg.type : "text",
        last_message_sender: lastMsg ? lastMsg.sender_id : null,
        last_message_read: lastMsg ? lastMsg.is_read : false,
      };
    });

    const sortedRecent = recent.sort((a, b) => {
      const timeA = times[a.chat_id] || 0;
      const timeB = times[b.chat_id] || 0;
      return timeB - timeA;
    });

    setRecentChats(sortedRecent);
    setIsLoadingChats(false); // ✅ Set loading false setelah selesai
  };
  useEffect(() => {
    fetchRecentChatsWithUnread();
  }, [user?.id]);

  // --- Subscribe to realtime untuk update unread badge ---
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("unread-badges")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.sender_id !== user.id) {
              setUnreadCounts((prev) => ({
                ...prev,
                [payload.new.chat_id]: (prev[payload.new.chat_id] || 0) + 1,
              }));

              setTotalUnreadMessages((prev) => prev + 1);
            }

            setRecentChats((prevChats) => {
              const chatIndex = prevChats.findIndex(
                (c) => c.chat_id === payload.new.chat_id,
              );

              if (chatIndex >= 0) {
                const updatedChats = [...prevChats];
                const [chat] = updatedChats.splice(chatIndex, 1);

                chat.last_message = payload.new.content;
                chat.last_message_type = payload.new.type;
                chat.last_message_sender = payload.new.sender_id;
                chat.last_message_read = payload.new.is_read;

                updatedChats.unshift(chat);
                return updatedChats;
              } else {
                fetchRecentChatsWithUnread();
                return prevChats;
              }
            });
          } else if (payload.eventType === "UPDATE") {
            setRecentChats((prevChats) => {
              const updatedChats = [...prevChats];
              const chatIndex = updatedChats.findIndex(
                (c) => c.chat_id === payload.new.chat_id,
              );
              if (chatIndex >= 0) {
                updatedChats[chatIndex] = {
                  ...updatedChats[chatIndex],
                  last_message_read:
                    payload.new.is_read ||
                    updatedChats[chatIndex].last_message_read,
                };
              }
              return updatedChats;
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // --- Mark messages as read function ---
  const markMessagesAsRead = async (chatIdToMark) => {
    if (!user?.id || !chatIdToMark) return;

    const { data: updatedMessages, error: updateError } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("chat_id", chatIdToMark)
      .eq("is_read", false)
      .neq("sender_id", user.id)
      .select();

    if (updateError) {
      return;
    }

    const unreadCount = updatedMessages?.length || 0;

    if (unreadCount === 0) {
      return;
    }

    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[chatIdToMark];
      return updated;
    });

    setTotalUnreadMessages((prev) => Math.max(0, prev - unreadCount));

    setTimeout(() => {
      fetchRecentChatsWithUnread();
    }, 300);
  };

  // --- Fetch messages dan realtime subscription untuk chat terpilih ---
  useEffect(() => {
    if (!selectedUser) return;

    let subscription = null;
    let currentChatId = null;

    const fetchChatAndMessages = async () => {
      let { data: chat } = await supabase
        .from("chats")
        .select("id, user1_id, user2_id, deleted_by, created_at")
        .or(
          `and(user1_id.eq.${user.id},user2_id.eq.${selectedUser.id}),and(user1_id.eq.${selectedUser.id},user2_id.eq.${user.id})`,
        )
        .maybeSingle();

      if (!chat) {
        const { data: newChat } = await supabase
          .from("chats")
          .insert([{ user1_id: user.id, user2_id: selectedUser.id }])
          .select("id, user1_id, user2_id, deleted_by, created_at")
          .single();
        chat = newChat;
      }

      currentChatId = chat.id;
      setChatId(chat.id);

      const deletedBy = chat.deleted_by || [];

      const userDeleted = deletedBy.find((item) => {
        return item.user_id === user.id;
      });

      let query = supabase
        .from("messages")
        .select("*")
        .eq("chat_id", currentChatId);

      if (userDeleted && userDeleted.deleted_at) {
        query = query.gt("created_at", userDeleted.deleted_at);
      } else {
      }

      const { data: msgs, error: msgError } = await query.order("created_at", {
        ascending: true,
      });

      if (msgs && msgs.length > 0) {
      }

      if (msgError) {
      }

      setMessages(msgs || []);

      await markMessagesAsRead(currentChatId);

      setTimeout(() => {
        fetchTotalUnread();
      }, 500);

      subscription = supabase
        .channel(`chat-${currentChatId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${currentChatId}`,
          },
          async (payload) => {
            setMessages((prev) => [...prev, payload.new]);

            if (payload.new.sender_id !== user.id) {
              await markMessagesAsRead(currentChatId);

              setTimeout(() => {
                fetchTotalUnread();
              }, 500);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${currentChatId}`,
          },
          (payload) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg,
              ),
            );
          },
        )
        .subscribe();
    };

    fetchChatAndMessages();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [selectedUser, user?.id, fetchTotalUnread]);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- Kirim pesan ---
  const sendMessage = async (type = "text", content = null) => {
    if (!selectedUser || (!input && type === "text")) return;

    let { data: chat } = await supabase
      .from("chats")
      .select("*")
      .or(
        `and(user1_id.eq.${user.id},user2_id.eq.${selectedUser.id}),and(user1_id.eq.${selectedUser.id},user2_id.eq.${user.id})`,
      )
      .maybeSingle();

    if (!chat) return;

    const messageContent = type === "text" ? input : JSON.stringify(content);

    await markMessagesAsRead(chat.id);

    const { error } = await supabase.from("messages").insert([
      {
        chat_id: chat.id,
        sender_id: user.id,
        type,
        content: messageContent,
        is_read: false,
      },
    ]);

    if (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengirim pesan. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#EAB308",
        confirmButtonText: "OK",
      });
      return;
    }

    // ✅ BARU: Kirim push notification ke penerima
    const recipientUserId = selectedUser.id;
    const senderName =
      user.user_metadata?.full_name || user.email || "Seseorang";

    await sendPushNotification(recipientUserId, senderName, messageContent);

    setInput("");
  };

  // --- Hapus pesan ---
  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      alert("Gagal menghapus pesan. Silakan coba lagi.");
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId),
    );
  };

  // --- Hapus chat beserta semua pesannya ---
  const handleDeleteChat = async (chatIdToDelete) => {
    if (!chatIdToDelete) return;

    const result = await Swal.fire({
      title: "Hapus Chat?",
      text: "Chat ini akan dihapus dari daftar Anda (lawan chat masih bisa melihatnya)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    const { data: chatData, error: fetchError } = await supabase
      .from("chats")
      .select("deleted_by")
      .eq("id", chatIdToDelete)
      .single();

    if (fetchError) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus chat. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#EAB308",
        confirmButtonText: "OK",
      });
      return;
    }

    let deletedBy = chatData.deleted_by || [];

    deletedBy = deletedBy.filter((item) => item.user_id !== user.id);

    const deletedAt = new Date().toISOString();

    const newEntry = {
      user_id: user.id,
      deleted_at: deletedAt,
    };

    deletedBy.push(newEntry);

    const { error: updateError } = await supabase
      .from("chats")
      .update({ deleted_by: deletedBy })
      .eq("id", chatIdToDelete);

    if (updateError) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus chat. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#EAB308",
        confirmButtonText: "OK",
      });
      return;
    }

    setRecentChats((prev) => prev.filter((c) => c.chat_id !== chatIdToDelete));
    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[chatIdToDelete];
      return updated;
    });

    if (chatId === chatIdToDelete) {
      setSelectedUser(null);
      setMessages([]);
      setChatId(null);
      setShowChatRoom(false);
    }

    setOpenChatDropdown(null);

    Swal.fire({
      title: "Berhasil!",
      text: "Chat berhasil dihapus dari daftar Anda",
      icon: "success",
      confirmButtonColor: "#EAB308",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // --- Modal tugas/kegiatan ---
  const handleSendTask = async () => {
    if (!user?.id) return;

    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });
    setTasks(tasksData || []);

    const { data: activitiesData } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.id)
      .order("activity_date", { ascending: true });
    setActivities(activitiesData || []);

    setShowModal(true);
  };

  // ✅ Handle select user untuk mobile
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setShowChatRoom(true); // Tampilkan chat room di mobile
  };

  // ✅ Handle back to sidebar di mobile
  const handleBackToSidebar = () => {
    setShowChatRoom(false);
    setSelectedUser(null);
  };

  const filteredUsers =
    search.trim() !== ""
      ? users.filter((u) => {
          const searchValue = search.trim().toUpperCase();
          const userIdValue = u.user_id ? u.user_id.toUpperCase() : "";
          const isMatch = userIdValue === searchValue;

          return u.user_id && isMatch;
        })
      : [];

  // --- Format waktu pesan ---
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const navbar = document.querySelector("nav");
    const header = document.querySelector("header");
    const sidebar = document.querySelector("aside"); // Sidebar website

    // Cek apakah sedang di mobile
    const isMobile = window.innerWidth < 768;

    if (showChatRoom && isMobile) {
      // Sembunyikan navbar & sidebar hanya di mobile
      if (navbar) navbar.style.display = "none";
      if (header) header.style.display = "none";
      if (sidebar) sidebar.style.display = "none";
      document.body.style.overflow = "hidden";
    } else {
      // Tampilkan kembali navbar & sidebar
      if (navbar) navbar.style.display = "";
      if (header) header.style.display = "";
      if (sidebar) sidebar.style.display = "";
      document.body.style.overflow = "";
    }

    // Handle resize
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;

      if (showChatRoom && isMobileNow) {
        if (navbar) navbar.style.display = "none";
        if (header) header.style.display = "none";
        if (sidebar) sidebar.style.display = "none";
      } else {
        if (navbar) navbar.style.display = "";
        if (header) header.style.display = "";
        if (sidebar) sidebar.style.display = "";
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (navbar) navbar.style.display = "";
      if (header) header.style.display = "";
      if (sidebar) sidebar.style.display = "";
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [showChatRoom]);

  const sendPushNotification = async (
    recipientUserId,
    senderName,
    messageText,
  ) => {
    try {
      const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
      const restApiKey = import.meta.env.VITE_ONESIGNAL_REST_API_KEY;

      if (!appId || !restApiKey) {
        console.warn("OneSignal API keys are missing in .env");
        return;
      }

      await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${restApiKey}`,
        },
        body: JSON.stringify({
          app_id: appId,
          include_external_user_ids: [recipientUserId],
          channel_for_external_user_ids: "push",
          headings: { en: `Pesan baru dari ${senderName}` },
          contents: { en: messageText.substring(0, 50) },
          url: window.location.origin + "/app/chat", // Arahkan ke halaman chat saat notif diklik
        }),
      });
    } catch (error) {
      console.error("Failed to send push notification:", error);
    }
  };

  return (
    <div
      className={`flex w-full ${
        showChatRoom
          ? "h-[100dvh] md:h-[calc(100vh-64px)] fixed md:relative top-0 left-0 z-50 md:z-auto"
          : "h-[calc(100vh-64px)]"
      } bg-white dark:bg-gray-900 overflow-hidden`}
    >
      <TaskActivityModal
        showModal={showModal}
        setShowModal={setShowModal}
        tasks={tasks}
        activities={activities}
        sendMessage={sendMessage}
      />

      {showProfileModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      <div
        className={`
          ${showChatRoom ? "hidden md:flex" : "flex"} 
          w-full md:w-80 
          flex-shrink-0
        `}
      >
        <ChatSidebar
          search={search}
          setSearch={setSearch}
          filteredUsers={filteredUsers}
          recentChats={recentChats}
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          unreadCounts={unreadCounts}
          openChatDropdown={openChatDropdown}
          setOpenChatDropdown={setOpenChatDropdown}
          handleDeleteChat={handleDeleteChat}
          isLoadingChats={isLoadingChats}
          isLoadingSearch={isLoadingSearch}
        />
      </div>

      <div
        className={`
          ${showChatRoom ? "flex" : "hidden md:flex"} 
          flex-col flex-1 w-full h-full relative bg-gray-50 dark:bg-gray-900
        `}
      >
        <div className="z-20 w-full shrink-0">
          <ChatHeader
            selectedUser={selectedUser}
            onBack={handleBackToSidebar}
            onProfileClick={() => setShowProfileModal(true)}
            onClearChat={() => handleDeleteChat(chatId)}
          />
        </div>

        <div className="flex-1 overflow-y-auto w-full relative">
          <MessageList
            messages={messages}
            userId={user.id}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            handleDeleteMessage={handleDeleteMessage}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
          />
        </div>

        <div className="z-20 w-full shrink-0">
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            handleSendTask={handleSendTask}
            selectedUser={selectedUser}
          />
        </div>
      </div>
    </div>
  );
}
