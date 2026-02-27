import { CheckCheck } from "lucide-react";
import type { Message } from "@/data/chatData";

const MessageBubble = ({ text, time, sent }: Message) => (
  <div className={`flex ${sent ? "justify-end" : "justify-start"} mb-2 animate-fade-in`}>
    <div
      className={`max-w-[65%] px-4 py-2 gs-bubble-shadow relative ${
        sent
          ? "bg-gs-msg-out text-gs-text-primary rounded-[18px] rounded-tr-[4px]"
          : "bg-gs-msg-in text-gs-text-primary rounded-[18px] rounded-tl-[4px]"
      }`}
    >
      <p className="text-[14.2px] leading-[1.55]">{text}</p>
      <div className={`flex items-center gap-1 mt-1 ${sent ? "justify-end" : "justify-end"}`}>
        <span className="text-[11px] text-gs-time font-medium">{time}</span>
        {sent && <CheckCheck className="w-[18px] h-[18px] text-gs-green" />}
      </div>
    </div>
  </div>
);

export default MessageBubble;
