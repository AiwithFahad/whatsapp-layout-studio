import { Search, Filter } from "lucide-react";
import ChatListItem from "./ChatListItem";
import type { Chat } from "@/data/chatData";

interface ChatListPanelProps {
  chats: Chat[];
  activeId: number;
  onSelect: (id: number) => void;
}

const ChatListPanel = ({ chats, activeId, onSelect }: ChatListPanelProps) => (
  <div className="flex flex-col h-full bg-card">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 gs-header-shadow">
      <h1 className="text-[22px] font-bold text-gs-text-primary tracking-tight">
        GhupShup
      </h1>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-gs-green bg-gs-green-light px-2.5 py-1 rounded-full">
          Premium
        </span>
      </div>
    </div>

    {/* Search Bar */}
    <div className="px-3 py-2">
      <div className="flex items-center gap-3 bg-gs-search rounded-xl px-4 py-2.5 gs-input-shadow transition-all duration-200 focus-within:ring-2 focus-within:ring-gs-green/20">
        <Search className="w-[18px] h-[18px] text-gs-text-secondary" />
        <input
          type="text"
          placeholder="Search or start new chat"
          className="bg-transparent text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none flex-1 font-medium"
          readOnly
        />
        <Filter className="w-[18px] h-[18px] text-gs-text-secondary" />
      </div>
    </div>

    {/* Tabs */}
    <div className="flex px-4 gap-1 py-1">
      <button className="px-4 py-1.5 text-[13px] font-semibold rounded-full bg-gs-green text-primary-foreground">
        All
      </button>
      <button className="px-4 py-1.5 text-[13px] font-medium rounded-full text-gs-text-secondary hover:bg-gs-hover transition-colors">
        Unread
      </button>
      <button className="px-4 py-1.5 text-[13px] font-medium rounded-full text-gs-text-secondary hover:bg-gs-hover transition-colors">
        Groups
      </button>
    </div>

    {/* Chat List */}
    <div className="flex-1 overflow-y-auto scrollbar-thin mt-1">
      {chats.map((chat, i) => (
        <div key={chat.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
          <ChatListItem chat={chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />
        </div>
      ))}
    </div>
  </div>
);

export default ChatListPanel;
