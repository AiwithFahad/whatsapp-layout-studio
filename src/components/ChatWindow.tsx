import { useState, useRef, useEffect } from "react";
import { Search, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send, ArrowLeft } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { Chat, Message } from "@/data/chatData";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onBack?: () => void;
  onSend?: (text: string) => void;
}

const ChatWindow = ({ chat, messages, onBack, onSend }: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gs-chat">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gs-header gs-header-shadow z-10 relative">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="mr-1 text-gs-text-secondary hover:text-gs-text-primary transition-colors md:hidden">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full gs-avatar-3d object-cover" />
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gs-online border-2 border-gs-header" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gs-text-primary text-[15px] leading-tight">{chat.name}</h2>
            <p className="text-[12px] mt-0.5 font-medium text-gs-green">
              {chat.online ? "online" : "last seen today at 9:45 AM"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gs-text-secondary">
          <Video className="w-[22px] h-[22px] cursor-pointer hover:text-gs-text-primary transition-colors hidden sm:block" />
          <Phone className="w-[20px] h-[20px] cursor-pointer hover:text-gs-text-primary transition-colors hidden sm:block" />
          <Search className="w-[20px] h-[20px] cursor-pointer hover:text-gs-text-primary transition-colors" />
          <MoreVertical className="w-[20px] h-[20px] cursor-pointer hover:text-gs-text-primary transition-colors" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin gs-chat-pattern px-4 py-4 sm:px-8 md:px-16 lg:px-20">
        <div className="flex justify-center mb-5">
          <span className="bg-card text-gs-text-secondary text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-lg gs-bubble-shadow">
            Today
          </span>
        </div>
        <div className="flex justify-center mb-6">
          <div className="bg-gs-green-light text-gs-green-dark text-[11.5px] px-4 py-2 rounded-lg max-w-md text-center leading-relaxed">
            🔒 Messages and calls are end-to-end encrypted.
          </div>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 bg-gs-header gs-header-shadow relative z-10">
        <Smile className="w-6 h-6 text-gs-text-secondary cursor-pointer hover:text-gs-text-primary transition-colors flex-shrink-0" />
        <Paperclip className="w-6 h-6 text-gs-text-secondary cursor-pointer hover:text-gs-text-primary transition-colors flex-shrink-0 hidden sm:block" />
        <div className="flex-1 bg-gs-search rounded-2xl px-5 py-3 gs-input-shadow">
          <input
            type="text"
            placeholder="Type a message..."
            className="bg-transparent text-[14px] text-gs-text-primary placeholder:text-gs-text-secondary outline-none w-full font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Mic className="w-6 h-6 text-gs-text-secondary cursor-pointer hover:text-gs-text-primary transition-colors flex-shrink-0 hidden sm:block" />
        <button
          onClick={handleSend}
          className="w-11 h-11 rounded-full bg-gs-green flex items-center justify-center cursor-pointer hover:bg-gs-green-dark transition-all duration-200 flex-shrink-0 gs-send-shadow"
        >
          <Send className="w-5 h-5 text-primary-foreground ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
