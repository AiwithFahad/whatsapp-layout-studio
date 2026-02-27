import { useState } from "react";
import ChatListPanel from "@/components/ChatListPanel";
import ChatWindow from "@/components/ChatWindow";
import EmptyChatView from "@/components/EmptyChatView";
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
    <div className="h-screen flex items-center justify-center bg-background">
      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-[128px] bg-gs-green z-0 hidden md:block" />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full md:h-[calc(100vh-32px)] md:max-w-[1600px] flex gs-card-shadow md:rounded-lg overflow-hidden">
        {/* Left Panel - Chat List */}
        <div
          className={`w-full md:w-[30%] md:min-w-[340px] md:max-w-[420px] flex-shrink-0 border-r border-border ${
            showChat ? "hidden md:flex" : "flex"
          } flex-col`}
        >
          <ChatListPanel chats={chats} activeId={activeChatId} onSelect={handleSelect} />
        </div>

        {/* Right Panel - Chat Window */}
        <div className={`flex-1 ${showChat ? "flex" : "hidden md:flex"} flex-col`}>
          {activeChat ? (
            <ChatWindow chat={activeChat} messages={messages} onBack={() => setShowChat(false)} />
          ) : (
            <EmptyChatView />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
