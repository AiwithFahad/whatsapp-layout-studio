import { useState } from "react";
import { Search, Filter, CircleDot } from "lucide-react";
import ChatListItem from "./ChatListItem";
import type { Chat } from "@/data/chatData";

interface ChatListPanelProps {
  chats: Chat[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onStatusClick?: () => void;
}

type Tab = "all" | "unread" | "groups";

const ChatListPanel = ({ chats, activeId, onSelect, onStatusClick }: ChatListPanelProps) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const filtered = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (tab === "unread") return chat.unread > 0;
    if (tab === "groups") return !!chat.isGroup;
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "groups", label: "Groups" },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-5 py-4 gs-header-shadow">
        <h1 className="text-[22px] font-bold text-gs-text-primary tracking-tight">GhupShup</h1>
        <div className="flex items-center gap-3">
          {onStatusClick && (
            <button
              onClick={onStatusClick}
              className="text-gs-green hover:text-gs-green-dark transition-colors"
              title="Status"
            >
              <CircleDot className="w-5 h-5" />
            </button>
          )}
          <span className="text-[10px] font-semibold tracking-wider uppercase text-gs-green bg-gs-green-light px-2.5 py-1 rounded-full">
            Premium
          </span>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center gap-3 bg-gs-search rounded-xl px-4 py-2.5 gs-input-shadow transition-all duration-200 focus-within:ring-2 focus-within:ring-gs-green/20">
          <Search className="w-[18px] h-[18px] text-gs-text-secondary" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none flex-1 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Filter className="w-[18px] h-[18px] text-gs-text-secondary" />
        </div>
      </div>

      <div className="flex px-4 gap-1 py-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-colors ${
              tab === t.key
                ? "bg-gs-green text-primary-foreground"
                : "text-gs-text-secondary hover:bg-gs-hover"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin mt-1">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gs-text-secondary text-sm">
            No chats found
          </div>
        ) : (
          filtered.map((chat, i) => (
            <div key={chat.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <ChatListItem chat={chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListPanel;
