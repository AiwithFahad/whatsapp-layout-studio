import type { Chat } from "@/data/chatData";

interface ChatListItemProps {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}

const ChatListItem = ({ chat, active, onClick }: ChatListItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-border transition-colors ${
      active ? "bg-wa-hover" : "hover:bg-wa-hover"
    }`}
  >
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
        {chat.avatar}
      </div>
      {chat.online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-wa-online border-2 border-card" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h3 className="font-medium text-foreground truncate text-[15px]">{chat.name}</h3>
        <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread > 0 ? "text-wa-unread" : "text-wa-time"}`}>
          {chat.time}
        </span>
      </div>
      <div className="flex justify-between items-center mt-0.5">
        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
        {chat.unread > 0 && (
          <span className="ml-2 flex-shrink-0 bg-wa-unread text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {chat.unread}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ChatListItem;
