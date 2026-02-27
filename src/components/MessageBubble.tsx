import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/data/chatData";

const MessageBubble = ({ text, time, sent }: Message) => (
  <div className={`flex ${sent ? "justify-end" : "justify-start"} mb-1`}>
    <div
      className={`max-w-[65%] px-3 py-1.5 rounded-lg text-[14.5px] leading-relaxed relative ${
        sent
          ? "bg-wa-msg-out text-foreground rounded-tr-none"
          : "bg-wa-msg-in text-foreground rounded-tl-none"
      }`}
    >
      <span>{text}</span>
      <span className="inline-flex items-center gap-1 ml-3 float-right mt-1.5 text-[11px] text-wa-time">
        {time}
        {sent && <CheckCheck className="w-4 h-4 text-wa-unread" />}
      </span>
    </div>
  </div>
);

export default MessageBubble;
