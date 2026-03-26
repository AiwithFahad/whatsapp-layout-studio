import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, CircleDot, MessageCircle, User, LogOut } from "lucide-react";
import ChatListItem from "./ChatListItem";
import { useAuth } from "@/hooks/useAuth";
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 gs-header-shadow">
        <h1 className="text-[22px] font-bold text-gs-text-primary tracking-tight">GhupShup</h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-gs-green bg-gs-green-light px-2.5 py-1 rounded-full">
            Premium
          </span>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-around px-2 py-1.5 border-b border-gs-divider bg-card">
        <button
          onClick={() => { /* already on messages */ }}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gs-green transition-colors"
          title="Messages"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Chats</span>
        </button>
        <button
          onClick={onStatusClick}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gs-text-secondary hover:text-gs-green transition-colors"
          title="Status"
        >
          <CircleDot className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Status</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gs-text-secondary hover:text-gs-green transition-colors"
          title="Profile & Settings"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gs-text-secondary hover:text-destructive transition-colors"
          title="Log Out"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 bg-gs-search rounded-xl px-4 py-2.5 gs-input-shadow transition-all duration-200 focus-within:ring-2 focus-within:ring-gs-green/20">
          <Search className="w-[18px] h-[18px] text-gs-text-secondary" />
          <input
            type="text"
            placeholder="Search chats, contacts, messages..."
            className="bg-transparent text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none flex-1 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gs-text-secondary hover:text-gs-text-primary text-xs font-semibold">
              Clear
            </button>
          )}
          <Filter className="w-[18px] h-[18px] text-gs-text-secondary" />
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin mt-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gs-text-secondary text-sm gap-1">
            <Search className="w-5 h-5 opacity-50" />
            <span>No chats found</span>
          </div>
        ) : (
          filtered.map((chat, i) => (
            <div key={chat.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <ChatListItem chat={chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />
            </div>
          ))
        )}
      </div>

      {/* User footer */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-gs-divider bg-card">
        <div className="w-9 h-9 rounded-full bg-gs-green flex items-center justify-center text-primary-foreground text-sm font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gs-text-primary truncate">{user.name}</p>
          <p className="text-[11px] text-gs-text-secondary truncate">{user.about}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatListPanel;
