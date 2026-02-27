import { useState } from "react";
import { CheckCheck, Volume2, VolumeX } from "lucide-react";
import type { Message } from "@/data/chatData";

const MessageBubble = ({ text, time, sent }: Message) => {
  const [speaking, setSpeaking] = useState(false);

  const handleTTS = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"} mb-2 animate-fade-in group`}>
      <div
        className={`max-w-[65%] px-4 py-2 gs-bubble-shadow relative ${
          sent
            ? "bg-gs-msg-out text-gs-text-primary rounded-[18px] rounded-tr-[4px]"
            : "bg-gs-msg-in text-gs-text-primary rounded-[18px] rounded-tl-[4px]"
        }`}
      >
        <p className="text-[14.2px] leading-[1.55]">{text}</p>
        <div className={`flex items-center gap-1 mt-1 justify-end`}>
          <button
            onClick={handleTTS}
            className="opacity-0 group-hover:opacity-100 transition-opacity mr-1"
            title={speaking ? "Stop" : "Listen"}
          >
            {speaking ? (
              <VolumeX className="w-3.5 h-3.5 text-gs-green" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-gs-text-secondary hover:text-gs-green transition-colors" />
            )}
          </button>
          <span className="text-[11px] text-gs-time font-medium">{time}</span>
          {sent && <CheckCheck className="w-[18px] h-[18px] text-gs-green" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
