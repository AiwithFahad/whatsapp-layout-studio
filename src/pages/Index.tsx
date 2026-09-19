import { useState, useCallback, useEffect, useRef } from "react";
import ChatListPanel from "@/components/ChatListPanel";
import ChatWindow from "@/components/ChatWindow";
import EmptyChatView from "@/components/EmptyChatView";
import StatusView from "@/components/StatusView";
import { initialChats, initialMessages, type Chat, type Message, type Attachment } from "@/data/chatData";

const CHATS_KEY = "gs_chats";
const MSGS_KEY = "gs_messages";

const loadChats = (): Chat[] => {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return initialChats;
    const parsed = JSON.parse(raw) as Chat[];
    // Re-attach bundled avatar URLs (they change between builds)
    return parsed.map((c) => ({
      ...c,
      avatar: initialChats.find((i) => i.id === c.id)?.avatar || c.avatar,
    }));
  } catch {
    return initialChats;
  }
};

const loadMessages = (): Record<number, Message[]> => {
  try {
    const raw = localStorage.getItem(MSGS_KEY);
    return raw ? JSON.parse(raw) : initialMessages;
  } catch {
    return initialMessages;
  }
};

const replies = [
  "That's interesting! 🤔",
  "Haha, nice! 😄",
  "Got it 👍",
  "Tell me more!",
  "Sure thing!",
  "Wow, that's great! 🎉",
  "I'll get back to you on that",
  "Sounds good to me 😊",
  "Absolutely! 💯",
  "Let me think about it...",
];

const Index = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(1);
  const [showChat, setShowChat] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [chats, setChats] = useState<Chat[]>(loadChats);
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(loadMessages);
  const activeChatIdRef = useRef(activeChatId);

  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  // Persist
  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    try {
      localStorage.setItem(MSGS_KEY, JSON.stringify(allMessages));
    } catch {
      // storage full (large media) — keep app running
    }
  }, [allMessages]);

  // Ask for notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const notify = useCallback((title: string, body: string, icon?: string) => {
    try {
      if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
        new Notification(title, { body, icon });
      }
    } catch {
      // ignore
    }
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSelect = useCallback((id: number) => {
    setActiveChatId(id);
    setShowChat(true);
    setShowStatus(false);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const handleSend = useCallback((text: string, attachment?: Attachment) => {
    const chatId = activeChatIdRef.current;
    if (!chatId) return;
    if (!text.trim() && !attachment) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const newMsg: Message = { id: Date.now(), text: text || "", time, sent: true, attachment };
    const lastMsgText = attachment
      ? `📎 ${attachment.type === "voice" ? "Voice message" : attachment.name}`
      : text;

    setAllMessages((prev) => ({ ...prev, [chatId]: [...(prev[chatId] || []), newMsg] }));
    setChats((prev) => {
      const updated = prev.map((c) => (c.id === chatId ? { ...c, lastMessage: lastMsgText, time } : c));
      const active = updated.find((c) => c.id === chatId)!;
      return [active, ...updated.filter((c) => c.id !== chatId)];
    });

    // Show "typing..." then reply
    setTimeout(() => {
      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, typing: true } : c)));
    }, 500);

    setTimeout(() => {
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
      const reply: Message = { id: Date.now() + 1, text: replyText, time: replyTime, sent: false };
      setAllMessages((prev) => ({ ...prev, [chatId]: [...(prev[chatId] || []), reply] }));
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                typing: false,
                lastMessage: replyText,
                time: replyTime,
                unread: activeChatIdRef.current === chatId && !document.hidden ? 0 : c.unread + 1,
              }
            : c
        )
      );
      const chat = chats.find((c) => c.id === chatId);
      notify(chat?.name || "New message", replyText, chat?.avatar);
    }, 2000);
  }, [chats, notify]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="fixed top-0 left-0 right-0 h-[128px] bg-gs-green z-0 hidden md:block" />
      <div className="relative z-10 w-full h-full md:h-[calc(100vh-32px)] md:max-w-[1600px] flex gs-card-shadow md:rounded-lg overflow-hidden">
        <div
          className={`w-full md:w-[30%] md:min-w-[340px] md:max-w-[420px] flex-shrink-0 border-r border-border ${
            showChat || showStatus ? "hidden md:flex" : "flex"
          } flex-col`}
        >
          <ChatListPanel
            chats={chats}
            activeId={activeChatId}
            onSelect={handleSelect}
            onStatusClick={() => { setShowStatus(true); setShowChat(false); }}
          />
        </div>
        <div className={`flex-1 ${showChat || showStatus ? "flex" : "hidden md:flex"} flex-col`}>
          {showStatus ? (
            <StatusView onBack={() => setShowStatus(false)} />
          ) : activeChat ? (
            <ChatWindow
              chat={activeChat}
              messages={allMessages[activeChat.id] || []}
              onBack={() => setShowChat(false)}
              onSend={handleSend}
            />
          ) : (
            <EmptyChatView />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
