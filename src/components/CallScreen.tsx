import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, X, Maximize2 } from "lucide-react";

interface CallScreenProps {
  chat: { name: string; avatar: string };
  isVideo: boolean;
  onEnd: () => void;
}

const CallScreen = ({ chat, isVideo, onEnd }: CallScreenProps) => {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(!isVideo);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState<"ringing" | "connected">("ringing");
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus("connected");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (status === "connected") {
      intervalRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gs-green-dark to-background flex flex-col items-center justify-between py-16 animate-fade-in"
      style={{ background: `linear-gradient(180deg, hsl(var(--gs-green-dark)) 0%, hsl(198 50% 10%) 100%)` }}
    >
      {/* Close button */}
      <button onClick={onEnd} className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
        <X className="w-6 h-6" />
      </button>

      {/* Contact info */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-28 h-28 rounded-full gs-avatar-3d object-cover"
            style={{ boxShadow: "0 8px 40px hsl(0 0% 0% / 0.4)" }}
          />
          {status === "ringing" && (
            <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/30 animate-ping" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-primary-foreground tracking-tight">{chat.name}</h2>
        <p className="text-primary-foreground/70 text-sm font-medium">
          {status === "ringing" ? (isVideo ? "Video calling..." : "Calling...") : formatDuration(duration)}
        </p>
      </div>

      {/* Spacer */}
      <div />

      {/* Call controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setMuted(!muted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            muted ? "bg-destructive" : "bg-primary-foreground/20"
          }`}
        >
          {muted ? <MicOff className="w-6 h-6 text-primary-foreground" /> : <Mic className="w-6 h-6 text-primary-foreground" />}
        </button>

        {isVideo && (
          <button
            onClick={() => setVideoOff(!videoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              videoOff ? "bg-destructive" : "bg-primary-foreground/20"
            }`}
          >
            {videoOff ? <VideoOff className="w-6 h-6 text-primary-foreground" /> : <Video className="w-6 h-6 text-primary-foreground" />}
          </button>
        )}

        <button
          className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center"
        >
          <Volume2 className="w-6 h-6 text-primary-foreground" />
        </button>

        <button
          onClick={onEnd}
          className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center gs-send-shadow transition-transform hover:scale-105"
          style={{ boxShadow: "0 4px 20px hsl(0 84% 60% / 0.5)" }}
        >
          <PhoneOff className="w-7 h-7 text-primary-foreground" />
        </button>
      </div>

      {/* Encryption notice */}
      <p className="text-primary-foreground/40 text-[11px] font-medium">
        🔒 End-to-end encrypted
      </p>
    </div>
  );
};

export default CallScreen;
