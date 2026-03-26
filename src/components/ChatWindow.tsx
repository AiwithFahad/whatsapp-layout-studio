import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send, ArrowLeft, Shield, X, ChevronUp, ChevronDown, Square, Trash2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import EmojiPicker from "./EmojiPicker";
import MediaAttachment from "./MediaAttachment";
import CallScreen from "./CallScreen";
import type { Chat, Message, Attachment, AttachmentType } from "@/data/chatData";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onBack?: () => void;
  onSend?: (text: string, attachment?: Attachment) => void;
}

const ChatWindow = ({ chat, messages, onBack, onSend }: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);

  // Attachment preview
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // In-chat search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchIndex(0);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = messages
      .filter((m) => m.text.toLowerCase().includes(q))
      .map((m) => m.id);
    setSearchResults(matches);
    setSearchIndex(0);
    if (matches.length > 0) {
      messageRefs.current[matches[0]]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery, messages]);

  const navigateSearch = (dir: 1 | -1) => {
    if (searchResults.length === 0) return;
    const next = (searchIndex + dir + searchResults.length) % searchResults.length;
    setSearchIndex(next);
    messageRefs.current[searchResults[next]]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed && !pendingAttachment) return;
    onSend?.(trimmed, pendingAttachment || undefined);
    setInput("");
    setShowEmoji(false);
    setPendingAttachment(null);
    setPendingPreviewUrl(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  // File attachment handler
  const handleFileSelect = useCallback((file: File, type: AttachmentType) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      const att: Attachment = {
        type,
        url,
        name: file.name,
        size: file.size,
      };
      // For audio/video, try to get duration
      if (type === "audio" || type === "video") {
        const el = document.createElement(type === "audio" ? "audio" : "video");
        el.src = url;
        el.onloadedmetadata = () => {
          att.duration = el.duration;
          setPendingAttachment(att);
          setPendingPreviewUrl(url);
        };
      } else {
        setPendingAttachment(att);
        setPendingPreviewUrl(type === "image" ? url : null);
      }
    };
    reader.readAsDataURL(file);
    setNotification(`📎 ${file.name} ready to send`);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const att: Attachment = {
            type: "voice",
            url: reader.result as string,
            name: "Voice message",
            duration: recordingTime,
          };
          onSend?.("", att);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      setNotification("🎤 Microphone access denied");
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (callType) {
    return <CallScreen chat={chat} isVideo={callType === "video"} onEnd={() => setCallType(null)} />;
  }

  const highlightedIds = new Set(searchResults);
  const currentHighlight = searchResults[searchIndex];

  return (
    <div className="flex flex-col h-full bg-gs-chat">
      {notification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-gs-green text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl gs-card-shadow animate-fade-in">
          {notification}
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gs-header gs-header-shadow z-10 relative">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="mr-1 text-gs-text-secondary hover:text-gs-text-primary transition-colors md:hidden">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full gs-avatar-3d object-cover" />
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gs-online border-2 border-gs-header" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gs-text-primary text-[15px] leading-tight">{chat.name}</h2>
            <p className="text-[12px] mt-0.5 font-medium text-gs-green">
              {chat.online ? "online" : "last seen today at 9:45 AM"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gs-text-secondary">
          <Video className="w-[22px] h-[22px] cursor-pointer hover:text-gs-text-primary transition-colors hidden sm:block" onClick={() => setCallType("video")} />
          <Phone className="w-[20px] h-[20px] cursor-pointer hover:text-gs-text-primary transition-colors hidden sm:block" onClick={() => setCallType("voice")} />
          <Search className="w-[20px] h-[20px] cursor-pointer hover:text-gs-text-primary transition-colors" onClick={() => setShowSearch(!showSearch)} />
          <MoreVertical className="w-[20px] h-[20px] cursor-pointer hover:text-gs-text-primary transition-colors" />
        </div>
      </div>

      {/* In-chat search bar */}
      {showSearch && (
        <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-gs-divider animate-fade-in">
          <Search className="w-4 h-4 text-gs-text-secondary flex-shrink-0" />
          <input type="text" placeholder="Search in conversation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none" autoFocus />
          {searchResults.length > 0 && <span className="text-[12px] text-gs-text-secondary font-medium flex-shrink-0">{searchIndex + 1}/{searchResults.length}</span>}
          <button onClick={() => navigateSearch(-1)} className="text-gs-text-secondary hover:text-gs-text-primary"><ChevronUp className="w-4 h-4" /></button>
          <button onClick={() => navigateSearch(1)} className="text-gs-text-secondary hover:text-gs-text-primary"><ChevronDown className="w-4 h-4" /></button>
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-gs-text-secondary hover:text-gs-text-primary"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin gs-chat-pattern px-4 py-4 sm:px-8 md:px-16 lg:px-20">
        <div className="flex justify-center mb-5">
          <span className="bg-card text-gs-text-secondary text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-lg gs-bubble-shadow">Today</span>
        </div>
        <div className="flex justify-center mb-6">
          <div className="bg-gs-green-light text-gs-green-dark text-[11.5px] px-4 py-2 rounded-lg max-w-md text-center leading-relaxed flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            Messages and calls are end-to-end encrypted.
          </div>
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={(el) => { messageRefs.current[msg.id] = el; }}
            className={`transition-all duration-300 ${currentHighlight === msg.id ? "ring-2 ring-gs-green rounded-xl" : highlightedIds.has(msg.id) ? "ring-1 ring-gs-green/30 rounded-xl" : ""}`}
          >
            <MessageBubble {...msg} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment preview bar */}
      {pendingAttachment && (
        <div className="flex items-center gap-3 px-5 py-2 bg-card border-t border-gs-divider animate-fade-in">
          {pendingPreviewUrl ? (
            <img src={pendingPreviewUrl} alt="Preview" className="w-14 h-14 rounded-lg object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gs-green/10 flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-gs-green" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-gs-text-primary truncate">{pendingAttachment.name}</p>
            <p className="text-[11px] text-gs-text-secondary capitalize">{pendingAttachment.type}</p>
          </div>
          <button onClick={() => { setPendingAttachment(null); setPendingPreviewUrl(null); }} className="text-gs-text-secondary hover:text-destructive transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 bg-gs-header gs-header-shadow z-10">
        {showEmoji && <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />}
        {showMedia && <MediaAttachment onClose={() => setShowMedia(false)} onFileSelect={handleFileSelect} />}

        {isRecording ? (
          /* Voice recording UI */
          <div className="flex-1 flex items-center gap-3">
            <button onClick={cancelRecording} className="text-destructive hover:text-destructive/80 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-semibold text-gs-text-primary">{formatRecTime(recordingTime)}</span>
              <div className="flex-1 h-1 bg-gs-divider rounded-full overflow-hidden">
                <div className="h-full bg-destructive rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
            <button onClick={stopRecording} className="w-11 h-11 rounded-full bg-gs-green flex items-center justify-center gs-send-shadow hover:bg-gs-green-dark transition-all">
              <Send className="w-5 h-5 text-primary-foreground ml-0.5" />
            </button>
          </div>
        ) : (
          /* Normal input UI */
          <>
            <Smile className="w-6 h-6 text-gs-text-secondary cursor-pointer hover:text-gs-green transition-colors flex-shrink-0" onClick={() => { setShowEmoji(!showEmoji); setShowMedia(false); }} />
            <Paperclip className="w-6 h-6 text-gs-text-secondary cursor-pointer hover:text-gs-green transition-colors flex-shrink-0 hidden sm:block" onClick={() => { setShowMedia(!showMedia); setShowEmoji(false); }} />
            <div className="flex-1 bg-gs-search rounded-2xl px-5 py-3 gs-input-shadow">
              <input
                type="text"
                placeholder="Type a message..."
                className="bg-transparent text-[14px] text-gs-text-primary placeholder:text-gs-text-secondary outline-none w-full font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { setShowEmoji(false); setShowMedia(false); }}
              />
            </div>
            {input.trim() || pendingAttachment ? (
              <button onClick={handleSend} className="w-11 h-11 rounded-full bg-gs-green flex items-center justify-center cursor-pointer hover:bg-gs-green-dark transition-all duration-200 flex-shrink-0 gs-send-shadow">
                <Send className="w-5 h-5 text-primary-foreground ml-0.5" />
              </button>
            ) : (
              <button onClick={startRecording} className="w-11 h-11 rounded-full bg-gs-green flex items-center justify-center cursor-pointer hover:bg-gs-green-dark transition-all duration-200 flex-shrink-0 gs-send-shadow">
                <Mic className="w-5 h-5 text-primary-foreground" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
