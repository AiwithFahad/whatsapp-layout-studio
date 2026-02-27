import { Search, MoreVertical, Smile, Paperclip, Mic, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { Chat, Message } from "@/data/chatData";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
}

const ChatWindow = ({ chat, messages }: ChatWindowProps) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-2.5 bg-wa-header border-b border-border">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
            {chat.avatar}
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-wa-online border-2 border-wa-header" />
          )}
        </div>
        <div>
          <h2 className="font-medium text-foreground text-[15px]">{chat.name}</h2>
          <p className="text-xs text-muted-foreground">
            {chat.online ? "online" : "last seen today at 9:45 AM"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5 text-muted-foreground">
        <Search className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
        <MoreVertical className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto scrollbar-thin wa-chat-pattern px-12 py-4 md:px-16">
      <div className="flex justify-center mb-4">
        <span className="bg-wa-msg-in text-muted-foreground text-xs px-3 py-1 rounded-lg shadow-sm">
          TODAY
        </span>
      </div>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} />
      ))}
    </div>

    {/* Input */}
    <div className="flex items-center gap-2 px-4 py-3 bg-wa-header border-t border-border">
      <Smile className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex-shrink-0" />
      <Paperclip className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex-shrink-0" />
      <div className="flex-1 bg-wa-search rounded-lg px-4 py-2.5">
        <input
          type="text"
          placeholder="Type a message"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          readOnly
        />
      </div>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0">
        <Send className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
  </div>
);

export default ChatWindow;
