import { useState, useCallback } from "react";
import ChatListPanel from "@/components/ChatListPanel";
import ChatWindow from "@/components/ChatWindow";
import EmptyChatView from "@/components/EmptyChatView";
import StatusView from "@/components/StatusView";
import { initialChats, initialMessages, type Chat, type Message, type Attachment } from "@/data/chatData";

const Index = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(1);
  const [showChat, setShowChat] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(initialMessages);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSelect = useCallback((id: number) => {
    setActiveChatId(id);
    setShowChat(true);
    setShowStatus(false);
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  const handleSend = useCallback((text: string) => {
    if (!activeChatId) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const newMsg: Message = {
      id: Date.now(),
      text,
      time,
      sent: true,
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));
    // Update last message in chat list and move to top
    setChats((prev) => {
      const updated = prev.map((c) =>
        c.id === activeChatId ? { ...c, lastMessage: text, time } : c
      );
      const active = updated.find((c) => c.id === activeChatId)!;
      return [active, ...updated.filter((c) => c.id !== activeChatId)];
    });

    // Simulate auto-reply after 1.5s
    setTimeout(() => {
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
      const reply: Message = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
        sent: false,
      };
      setAllMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), reply],
      }));
    }, 1500);
  }, [activeChatId]);

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
