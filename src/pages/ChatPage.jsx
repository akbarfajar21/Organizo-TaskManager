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

  // ✅ TAMBAHKAN STATE INI untuk mobile view
  const [showChatRoom, setShowChatRoom] = useState(false);

  // Modal tugas/kegiatan
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // Dropdown menu untuk setiap pesan
  const [openDropdown, setOpenDropdown] = useState(null);

  // Dropdown menu untuk sidebar chat (hapus chat)
  const [openChatDropdown, setOpenChatDropdown] = useState(null);

  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (
        chatDropdownRef.current &&
        !chatDropdownRef.current.contains(event.target)
      ) {
        setOpenChatDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Fetch semua user kecuali diri sendiri ---
  useEffect(() => {
    if (!user?.id) return;

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, user_id")
        .neq("id", user.id);

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        console.log("Fetched users:", data);
        setUsers(data || []);
      }
    };

    fetchUsers();
  }, [user?.id]);

  // --- Fetch recent chats dan unread counts ---
  const fetchRecentChatsWithUnread = async () => {
    if (!user?.id) return;

    const { data: chats, error: chatError } = await supabase
      .from("chats")
      .select("id, user1_id, user2_id, deleted_by")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (chatError || !chats || chats.length === 0) {
      setRecentChats([]);
      setUnreadCounts({});
      setTotalUnreadMessages(0);
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
      return;
    }

    const chatIds = activeChats.map((c) => c.id);

    const { data: messagesData, error: msgError } = await supabase
      .from("messages")
      .select("chat_id, created_at, is_read, sender_id")
      .in("chat_id", chatIds);

    if (msgError || !messagesData) {
      setRecentChats([]);
      setUnreadCounts({});
      setTotalUnreadMessages(0);
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
      return;
    }

    const userIds = chatsWithRecentMessages
      .map((c) => (c.user1_id === user.id ? c.user2_id : c.user1_id))
      .filter((v, i, a) => a.indexOf(v) === i);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name,avatar_url")
      .in("id", userIds);

    const counts = {};
    let totalUnread = 0;

    messagesData.forEach((msg) => {
      if (!msg.is_read && msg.sender_id !== user.id) {
        const chat = chatsWithRecentMessages.find((c) => c.id === msg.chat_id);
        if (chat) {
          const deletedBy = chat.deleted_by || [];
          const userDeleted = deletedBy.find(
            (item) => item.user_id === user.id
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

    const recent = chatsWithRecentMessages.map((c) => {
      const otherUser =
        profiles.find(
          (p) => p.id === (c.user1_id === user.id ? c.user2_id : c.user1_id)
        ) || {};
      return {
        chat_id: c.id,
        ...otherUser,
      };
    });

    const times = {};
    messagesData.forEach((msg) => {
      const msgTime = new Date(msg.created_at).getTime();
      if (!times[msg.chat_id] || times[msg.chat_id] < msgTime) {
        times[msg.chat_id] = msgTime;
      }
    });

    const sortedRecent = recent.sort((a, b) => {
      const timeA = times[a.chat_id] || 0;
      const timeB = times[b.chat_id] || 0;
      return timeB - timeA;
    });

    setRecentChats(sortedRecent);
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
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          if (payload.new.sender_id !== user.id) {
            setUnreadCounts((prev) => ({
              ...prev,
              [payload.new.chat_id]: (prev[payload.new.chat_id] || 0) + 1,
            }));

            setTotalUnreadMessages((prev) => prev + 1);
          }

          setRecentChats((prevChats) => {
            const chatIndex = prevChats.findIndex(
              (c) => c.chat_id === payload.new.chat_id
            );

            if (chatIndex > 0) {
              const updatedChats = [...prevChats];
              const [chat] = updatedChats.splice(chatIndex, 1);
              updatedChats.unshift(chat);
              return updatedChats;
            } else if (chatIndex === -1) {
              fetchRecentChatsWithUnread();
            }

            return prevChats;
          });
        }
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
      console.error("❌ Error marking messages as read:", updateError);
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
          `and(user1_id.eq.${user.id},user2_id.eq.${selectedUser.id}),and(user1_id.eq.${selectedUser.id},user2_id.eq.${user.id})`
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

      console.log("🔵 Data chat lengkap:", chat);

      const deletedBy = chat.deleted_by || [];

      console.log("🔍 Isi deleted_by:", JSON.stringify(deletedBy, null, 2));
      console.log("🔍 User ID saat ini:", user.id);
      console.log(
        "🔍 Tipe data deleted_by:",
        typeof deletedBy,
        Array.isArray(deletedBy)
      );

      const userDeleted = deletedBy.find((item) => {
        console.log("🔍 Cek item:", item, "user_id:", item?.user_id);
        return item.user_id === user.id;
      });

      console.log("🔵 Fetch messages untuk chat:", {
        chatId: currentChatId,
        deletedBy: deletedBy,
        userDeleted: userDeleted,
        deletedAt: userDeleted?.deleted_at,
      });

      let query = supabase
        .from("messages")
        .select("*")
        .eq("chat_id", currentChatId);

      if (userDeleted && userDeleted.deleted_at) {
        console.log("🟡 Filter pesan setelah:", userDeleted.deleted_at);
        query = query.gt("created_at", userDeleted.deleted_at);
      } else {
        console.log("⚠️ Tidak ada filter, tampilkan semua pesan");
      }

      const { data: msgs, error: msgError } = await query.order("created_at", {
        ascending: true,
      });

      console.log("🟢 Pesan yang diambil:", msgs?.length || 0, "pesan");
      if (msgs && msgs.length > 0) {
        console.log("🟢 Pesan pertama created_at:", msgs[0].created_at);
        console.log(
          "🟢 Pesan terakhir created_at:",
          msgs[msgs.length - 1].created_at
        );
      }

      if (msgError) {
        console.error("Error fetch messages:", msgError);
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
            console.log("📩 Pesan baru masuk:", payload.new);
            setMessages((prev) => [...prev, payload.new]);

            if (payload.new.sender_id !== user.id) {
              await markMessagesAsRead(currentChatId);

              setTimeout(() => {
                fetchTotalUnread();
              }, 500);
            }
          }
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
        `and(user1_id.eq.${user.id},user2_id.eq.${selectedUser.id}),and(user1_id.eq.${selectedUser.id},user2_id.eq.${user.id})`
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
      console.error("Gagal mengirim pesan:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengirim pesan. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#EAB308",
        confirmButtonText: "OK",
      });
      return;
    }

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
      console.error("Gagal menghapus pesan:", error.message);
      alert("Gagal menghapus pesan. Silakan coba lagi.");
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
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
      console.error("Gagal mengambil data chat:", fetchError.message);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus chat. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#EAB308",
        confirmButtonText: "OK",
      });
      return;
    }

    console.log("🔍 Data chat sebelum hapus:", chatData);

    let deletedBy = chatData.deleted_by || [];

    console.log(
      "🔍 deleted_by sebelum filter:",
      JSON.stringify(deletedBy, null, 2)
    );

    deletedBy = deletedBy.filter((item) => item.user_id !== user.id);

    console.log(
      "🔍 deleted_by setelah filter:",
      JSON.stringify(deletedBy, null, 2)
    );

    const deletedAt = new Date().toISOString();

    const newEntry = {
      user_id: user.id,
      deleted_at: deletedAt,
    };

    deletedBy.push(newEntry);

    console.log("🔴 Menghapus chat dengan data:", {
      chatId: chatIdToDelete,
      userId: user.id,
      deletedAt: deletedAt,
      deletedBy: deletedBy,
    });

    console.log(
      "🔍 deleted_by yang akan disimpan:",
      JSON.stringify(deletedBy, null, 2)
    );

    const { error: updateError } = await supabase
      .from("chats")
      .update({ deleted_by: deletedBy })
      .eq("id", chatIdToDelete);

    if (updateError) {
      console.error("❌ Gagal update deleted_by:", updateError.message);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus chat. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#EAB308",
        confirmButtonText: "OK",
      });
      return;
    }

    console.log("✅ Berhasil update deleted_by");

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
      // ✅ Kembali ke sidebar di mobile
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

  // ✅ MODIFIKASI: Handle select user untuk mobile
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setShowChatRoom(true); // Tampilkan chat room di mobile
  };

  // ✅ TAMBAHKAN: Handle back to sidebar di mobile
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

          console.log(`Checking: "${u.user_id}" === "${search}"? ${isMatch}`);

          return u.user_id && isMatch;
        })
      : [];

  console.log("Search input:", `"${search}"`);
  console.log("Filtered results:", filteredUsers.length, "users");

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

  return (
    // ✅ Height dinamis: full screen di mobile saat chat room, normal di desktop
    <div
      className={`flex ${
        showChatRoom
          ? "h-screen md:h-[calc(100vh-64px)]"
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

      {/* SIDEBAR CHAT - Hidden di mobile saat chat room aktif */}
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
          chatDropdownRef={chatDropdownRef}
        />
      </div>

      {/* CHAT ROOM - Hidden di mobile saat sidebar aktif */}
      <div
        className={`
          ${showChatRoom ? "flex" : "hidden md:flex"} 
          flex-1 
          w-full
          h-full
          relative
        `}
      >
        {/* FIXED HEADER */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <ChatHeader
            selectedUser={selectedUser}
            onBack={handleBackToSidebar}
          />
        </div>

        {/* SCROLLABLE MESSAGE LIST */}
        <div className="absolute top-14 md:top-16 bottom-16 md:bottom-20 left-0 right-0 overflow-y-auto overflow-x-hidden">
          <MessageList
            messages={messages}
            userId={user.id}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            handleDeleteMessage={handleDeleteMessage}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
            dropdownRef={dropdownRef}
          />
        </div>

        {/* FIXED INPUT */}
        <div className="absolute bottom-0 left-0 right-0 z-50">
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
