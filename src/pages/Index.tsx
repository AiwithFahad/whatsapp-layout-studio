import { useState } from "react";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import EmptyChat from "@/components/EmptyChat";
import { chats, messages } from "@/data/chatData";

const Index = () => {
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [showChat, setShowChat] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSelect = (id: number) => {
    setActiveChatId(id);
    setShowChat(true);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background p-0 md:p-4">
      {/* Top green bar */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-wa-teal-dark z-0 hidden md:block" />

      <div className="relative z-10 w-full h-full md:h-[calc(100vh-2rem)] md:max-w-[1600px] flex shadow-2xl md:rounded-sm overflow-hidden">
        {/* Chat List - hidden on mobile when chat is open */}
        <div className={`w-full md:w-[420px] flex-shrink-0 ${showChat ? "hidden md:flex" : "flex"} flex-col`}>
          <ChatList chats={chats} activeId={activeChatId} onSelect={handleSelect} />
        </div>

        {/* Chat Window */}
        <div className={`flex-1 ${showChat ? "flex" : "hidden md:flex"} flex-col`}>
          {activeChat ? (
            <div className="flex flex-col h-full">
              {/* Mobile back button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowChat(false)}
                  className="absolute top-3 left-3 z-20 text-foreground bg-wa-header rounded-full p-1.5"
                >
                  ←
                </button>
              </div>
              <ChatWindow chat={activeChat} messages={messages} />
            </div>
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
