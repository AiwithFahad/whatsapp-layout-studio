import { useState, useRef } from "react";
import { CheckCheck, Volume2, VolumeX, Play, Pause, FileText, Download, Film } from "lucide-react";
import type { Message } from "@/data/chatData";

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (sec?: number) => {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const MessageBubble = ({ text, time, sent, attachment }: Message) => {
  const [speaking, setSpeaking] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
    setAudioProgress(pct);
  };

  const handleAudioEnded = () => {
    setPlaying(false);
    setAudioProgress(0);
  };

  const isSent = sent;
  const bubbleClass = isSent
    ? "bg-gs-msg-out text-gs-text-primary rounded-[18px] rounded-tr-[4px]"
    : "bg-gs-msg-in text-gs-text-primary rounded-[18px] rounded-tl-[4px]";

  const renderAttachment = () => {
    if (!attachment) return null;

    switch (attachment.type) {
      case "image":
        return (
          <div className="mb-1.5 -mx-2 -mt-1">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="rounded-xl max-w-full max-h-[280px] object-cover w-full cursor-pointer"
              onClick={() => window.open(attachment.url, "_blank")}
            />
          </div>
        );

      case "video":
        return (
          <div className="mb-1.5 -mx-2 -mt-1 relative">
            <video
              src={attachment.url}
              className="rounded-xl max-w-full max-h-[280px] w-full"
              controls
              preload="metadata"
            />
          </div>
        );

      case "voice":
      case "audio":
        return (
          <div className="flex items-center gap-3 mb-1 min-w-[200px]">
            <audio
              ref={audioRef}
              src={attachment.url}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={handleAudioEnded}
              preload="metadata"
            />
            <button
              onClick={toggleAudio}
              className="w-9 h-9 rounded-full bg-gs-green flex items-center justify-center flex-shrink-0"
            >
              {playing ? (
                <Pause className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-gs-divider rounded-full overflow-hidden">
                <div
                  className="h-full bg-gs-green rounded-full transition-all duration-100"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-gs-time mt-1">
                {attachment.type === "voice" ? "Voice message" : attachment.name}
                {attachment.duration ? ` · ${formatDuration(attachment.duration)}` : ""}
              </p>
            </div>
          </div>
        );

      case "document":
        return (
          <div className="flex items-center gap-3 mb-1.5 p-2 rounded-xl bg-gs-hover/50 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-gs-green/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-gs-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gs-text-primary truncate">{attachment.name}</p>
              <p className="text-[11px] text-gs-time">{formatFileSize(attachment.size)}</p>
            </div>
            <a
              href={attachment.url}
              download={attachment.name}
              className="text-gs-text-secondary hover:text-gs-green transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2 animate-fade-in group`}>
      <div className={`max-w-[65%] px-4 py-2 gs-bubble-shadow relative ${bubbleClass}`}>
        {renderAttachment()}
        {text && <p className="text-[14.2px] leading-[1.55]">{text}</p>}
        <div className="flex items-center gap-1 mt-1 justify-end">
          {text && (
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
          )}
          <span className="text-[11px] text-gs-time font-medium">{time}</span>
          {isSent && <CheckCheck className="w-[18px] h-[18px] text-gs-green" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
