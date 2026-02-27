import { useState } from "react";
import { ArrowLeft, Plus, Camera, X, Eye } from "lucide-react";
import { initialChats } from "@/data/chatData";

interface StatusItem {
  id: number;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  content: string;
}

const SAMPLE_STATUSES: StatusItem[] = [
  { id: 1, name: "Alice Johnson", avatar: initialChats[0].avatar, time: "Today, 10:15 AM", viewed: false, content: "Feeling amazing today! ✨" },
  { id: 2, name: "David Park", avatar: initialChats[3].avatar, time: "Today, 9:30 AM", viewed: false, content: "Weekend vibes 🎉" },
  { id: 3, name: "Emma Davis", avatar: initialChats[8].avatar, time: "Yesterday, 8:00 PM", viewed: true, content: "New PR at the gym 💪" },
  { id: 4, name: "Rehan Ahmed", avatar: initialChats[6].avatar, time: "Yesterday, 6:45 PM", viewed: true, content: "Check out my new design! 🎨" },
];

interface StatusViewProps {
  onBack: () => void;
}

const StatusView = ({ onBack }: StatusViewProps) => {
  const [statuses] = useState(SAMPLE_STATUSES);
  const [viewingStatus, setViewingStatus] = useState<StatusItem | null>(null);
  const [myStatus, setMyStatus] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [statusText, setStatusText] = useState("");

  const addStatus = () => {
    if (statusText.trim()) {
      setMyStatus(statusText.trim());
      setShowInput(false);
      setStatusText("");
    }
  };

  if (viewingStatus) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, hsl(var(--gs-green-dark)) 0%, hsl(198 50% 10%) 100%)" }}
      >
        <button onClick={() => setViewingStatus(null)} className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground">
          <X className="w-6 h-6" />
        </button>
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <img src={viewingStatus.avatar} alt="" className="w-10 h-10 rounded-full gs-avatar-3d object-cover" />
          <div>
            <p className="text-primary-foreground font-semibold text-sm">{viewingStatus.name}</p>
            <p className="text-primary-foreground/50 text-xs">{viewingStatus.time}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="absolute top-2 left-4 right-4 h-0.5 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary-foreground rounded-full animate-[progress_5s_linear_forwards]" style={{ animation: "progress 5s linear forwards" }} />
        </div>
        <p className="text-primary-foreground text-3xl font-bold text-center px-8">{viewingStatus.content}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center gap-3 px-5 py-4 gs-header-shadow">
        <button onClick={onBack} className="text-gs-text-secondary hover:text-gs-text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[20px] font-bold text-gs-text-primary tracking-tight">Status</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* My status */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowInput(true)}>
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gs-green-light flex items-center justify-center">
                {myStatus ? (
                  <span className="text-xl">✨</span>
                ) : (
                  <Camera className="w-6 h-6 text-gs-green" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gs-green flex items-center justify-center border-2 border-card">
                <Plus className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gs-text-primary text-[15px]">My Status</p>
              <p className="text-[13px] text-gs-text-secondary">
                {myStatus || "Tap to add status update"}
              </p>
            </div>
          </div>
        </div>

        {showInput && (
          <div className="px-4 pb-3 animate-fade-in">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your status..."
                className="flex-1 bg-gs-search rounded-xl px-4 py-2.5 text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none gs-input-shadow"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addStatus()}
                autoFocus
              />
              <button
                onClick={addStatus}
                className="px-4 py-2.5 bg-gs-green text-primary-foreground rounded-xl text-sm font-semibold hover:bg-gs-green-dark transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Recent updates */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Recent updates</p>
        </div>
        {statuses.filter(s => !s.viewed).map((status) => (
          <div
            key={status.id}
            onClick={() => setViewingStatus(status)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gs-hover transition-colors"
          >
            <div className="relative">
              <img src={status.avatar} alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: "3px solid hsl(var(--gs-green))" }} />
            </div>
            <div>
              <p className="font-semibold text-gs-text-primary text-[15px]">{status.name}</p>
              <p className="text-[13px] text-gs-text-secondary">{status.time}</p>
            </div>
          </div>
        ))}

        {/* Viewed updates */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Viewed updates</p>
        </div>
        {statuses.filter(s => s.viewed).map((status) => (
          <div
            key={status.id}
            onClick={() => setViewingStatus(status)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gs-hover transition-colors"
          >
            <div className="relative">
              <img src={status.avatar} alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: "3px solid hsl(var(--gs-text-secondary) / 0.3)" }} />
            </div>
            <div>
              <p className="font-semibold text-gs-text-primary text-[15px]">{status.name}</p>
              <p className="text-[13px] text-gs-text-secondary">{status.time}</p>
            </div>
            <Eye className="w-4 h-4 text-gs-text-secondary ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusView;
