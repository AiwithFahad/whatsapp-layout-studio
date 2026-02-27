import { Search, MessageCirclePlus, MoreVertical, Filter } from "lucide-react";
import ChatListItem from "./ChatListItem";
import type { Chat } from "@/data/chatData";

interface ChatListProps {
  chats: Chat[];
  activeId: number;
  onSelect: (id: number) => void;
}

const ChatList = ({ chats, activeId, onSelect }: ChatListProps) => (
  <div className="flex flex-col h-full bg-card border-r border-border">
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 bg-wa-header">
      <h1 className="text-xl font-semibold text-foreground">Chats</h1>
      <div className="flex items-center gap-4 text-muted-foreground">
        <MessageCirclePlus className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
        <MoreVertical className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
      </div>
    </div>

    {/* Search */}
    <div className="px-3 py-2">
      <div className="flex items-center gap-3 bg-wa-search rounded-lg px-3 py-1.5">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search or start new chat"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          readOnly
        />
        <Filter className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>

    {/* Chat list */}
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />
      ))}
    </div>
  </div>
);

export default ChatList;
