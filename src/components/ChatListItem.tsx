import type { Chat } from "@/data/chatData";

interface ChatListItemProps {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}

const ChatListItem = ({ chat, active, onClick }: ChatListItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 group ${
      active
        ? "bg-gs-active"
        : "hover:bg-gs-hover"
    }`}
  >
    {/* 3D Avatar */}
    <div className="relative flex-shrink-0">
      <img
        src={chat.avatar}
        alt={chat.name}
        className="w-[52px] h-[52px] rounded-full gs-avatar-3d object-cover"
      />
      {chat.online && (
        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-gs-online border-[2.5px] border-card" />
      )}
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0 border-b border-gs-divider py-1">
      <div className="flex justify-between items-baseline mb-0.5">
        <h3 className="font-semibold text-gs-text-primary truncate text-[15px] leading-tight">
          {chat.name}
        </h3>
        <span
          className={`text-[11px] font-medium flex-shrink-0 ml-3 ${
            chat.unread > 0 ? "text-gs-unread" : "text-gs-time"
          }`}
        >
          {chat.time}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[13px] text-gs-text-secondary truncate leading-relaxed">
          {chat.typing ? (
            <span className="text-gs-green font-medium italic">typing...</span>
          ) : (
            chat.lastMessage
          )}
        </p>
        {chat.unread > 0 && (
          <span className="ml-2 flex-shrink-0 bg-gs-unread text-primary-foreground text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
            {chat.unread}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ChatListItem;
