import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, Camera, X, Eye, Image as ImageIcon, Trash2 } from "lucide-react";
import { initialChats } from "@/data/chatData";
import { useAuth } from "@/hooks/useAuth";

interface StatusItem {
  id: number;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  content: string;
  image?: string;
  viewers?: number;
  mine?: boolean;
}

const SAMPLE_STATUSES: StatusItem[] = [
  { id: 1, name: "Alice Johnson", avatar: initialChats[0].avatar, time: "Today, 10:15 AM", viewed: false, content: "Feeling amazing today! ✨", viewers: 12 },
  { id: 2, name: "David Park", avatar: initialChats[3].avatar, time: "Today, 9:30 AM", viewed: false, content: "Weekend vibes 🎉", viewers: 8 },
  { id: 3, name: "Emma Davis", avatar: initialChats[8].avatar, time: "Yesterday, 8:00 PM", viewed: true, content: "New PR at the gym 💪", viewers: 21 },
  { id: 4, name: "Rehan Ahmed", avatar: initialChats[6].avatar, time: "Yesterday, 6:45 PM", viewed: true, content: "Check out my new design! 🎨", viewers: 34 },
];

const VIEWED_KEY = "gs_status_viewed";
const MINE_KEY = "gs_my_statuses";

interface StatusViewProps {
  onBack: () => void;
}

const StatusView = ({ onBack }: StatusViewProps) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [viewedIds, setViewedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]"); } catch { return []; }
  });
  const [myStatuses, setMyStatuses] = useState<StatusItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(MINE_KEY) || "[]"); } catch { return []; }
  });
  const [viewingStatus, setViewingStatus] = useState<StatusItem | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem(VIEWED_KEY, JSON.stringify(viewedIds)); }, [viewedIds]);
  useEffect(() => {
    try { localStorage.setItem(MINE_KEY, JSON.stringify(myStatuses)); } catch { /* storage full */ }
  }, [myStatuses]);

  const statuses = SAMPLE_STATUSES.map((s) => ({ ...s, viewed: s.viewed || viewedIds.includes(s.id) }));

  const openStatus = (s: StatusItem) => {
    setViewingStatus(s);
    if (!s.mine && !viewedIds.includes(s.id)) setViewedIds((prev) => [...prev, s.id]);
  };

  const addStatus = () => {
    if (!statusText.trim() && !pendingImage) return;
    const now = new Date();
    const item: StatusItem = {
      id: Date.now(),
      name: user.name,
      avatar: user.avatar,
      time: `Today, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`,
      viewed: false,
      content: statusText.trim(),
      image: pendingImage || undefined,
      viewers: 0,
      mine: true,
    };
    setMyStatuses((prev) => [item, ...prev]);
    setStatusText("");
    setPendingImage(null);
    setShowInput(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setPendingImage(reader.result as string); setShowInput(true); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const Ring = ({ src, name, seen }: { src?: string; name: string; seen: boolean }) => (
    src ? (
      <img src={src} alt={name} className="w-12 h-12 rounded-full object-cover"
        style={{ border: `3px solid ${seen ? "hsl(var(--gs-text-secondary) / 0.3)" : "hsl(var(--gs-green))"}` }} />
    ) : (
      <div className="w-12 h-12 rounded-full bg-gs-green flex items-center justify-center text-primary-foreground font-bold"
        style={{ border: `3px solid ${seen ? "hsl(var(--gs-text-secondary) / 0.3)" : "hsl(var(--gs-green))"}` }}>
        {name.charAt(0)}
      </div>
    )
  );

  if (viewingStatus) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, hsl(var(--gs-green-dark)) 0%, hsl(198 50% 10%) 100%)" }}
      >
        <button onClick={() => setViewingStatus(null)} className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground z-10">
          <X className="w-6 h-6" />
        </button>
        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
          {viewingStatus.avatar ? (
            <img src={viewingStatus.avatar} alt="" className="w-10 h-10 rounded-full gs-avatar-3d object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gs-green flex items-center justify-center text-primary-foreground font-bold">
              {viewingStatus.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-primary-foreground font-semibold text-sm">{viewingStatus.mine ? "My Status" : viewingStatus.name}</p>
            <p className="text-primary-foreground/50 text-xs">{viewingStatus.time}</p>
          </div>
        </div>
        <div className="absolute top-2 left-4 right-4 h-0.5 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary-foreground rounded-full" style={{ animation: "progress 5s linear forwards" }} />
        </div>

        <div className="flex flex-col items-center gap-5 px-8">
          {viewingStatus.image && (
            <img src={viewingStatus.image} alt="" className="max-h-[60vh] max-w-full rounded-2xl object-contain" />
          )}
          {viewingStatus.content && (
            <p className="text-primary-foreground text-2xl sm:text-3xl font-bold text-center">{viewingStatus.content}</p>
          )}
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
            <Eye className="w-4 h-4" /> {viewingStatus.viewers ?? 0} views
          </span>
          {viewingStatus.mine && (
            <button
              onClick={() => { setMyStatuses((p) => p.filter((s) => s.id !== viewingStatus.id)); setViewingStatus(null); }}
              className="flex items-center gap-1.5 text-destructive text-sm font-semibold"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>
    );
  }

  const recent = statuses.filter((s) => !s.viewed);
  const seen = statuses.filter((s) => s.viewed);

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
          <div className="flex items-center gap-3">
            <div
              className="relative cursor-pointer"
              onClick={() => (myStatuses.length ? openStatus(myStatuses[0]) : setShowInput(true))}
            >
              {myStatuses.length && myStatuses[0].image ? (
                <img src={myStatuses[0].image} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: "3px solid hsl(var(--gs-green))" }} />
              ) : user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gs-green-light flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gs-green" />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setShowInput(true); }}
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gs-green flex items-center justify-center border-2 border-card"
              >
                <Plus className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => (myStatuses.length ? openStatus(myStatuses[0]) : setShowInput(true))}>
              <p className="font-semibold text-gs-text-primary text-[15px]">My Status</p>
              <p className="text-[13px] text-gs-text-secondary truncate">
                {myStatuses.length
                  ? `${myStatuses.length} update${myStatuses.length > 1 ? "s" : ""} · ${myStatuses[0].time}`
                  : "Tap to add status update"}
              </p>
            </div>
          </div>
        </div>

        {showInput && (
          <div className="px-4 pb-3 animate-fade-in space-y-2">
            {pendingImage && (
              <div className="relative inline-block">
                <img src={pendingImage} alt="" className="h-28 rounded-xl object-cover" />
                <button onClick={() => setPendingImage(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-gs-divider flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-gs-text-secondary" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="px-3 rounded-xl bg-gs-search gs-input-shadow text-gs-text-secondary hover:text-gs-green transition-colors" title="Add photo">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
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
            <div className="flex items-center gap-1.5 text-[11px] text-gs-text-secondary">
              <Eye className="w-3 h-3" /> Visible to your contacts for 24 hours
            </div>
          </div>
        )}

        {myStatuses.length > 1 && (
          <>
            <div className="px-4 pt-2 pb-2">
              <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">My updates</p>
            </div>
            {myStatuses.map((s) => (
              <div key={s.id} onClick={() => openStatus(s)} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gs-hover transition-colors">
                <Ring src={s.image || s.avatar} name={s.name} seen={false} />
                <div className="min-w-0">
                  <p className="font-semibold text-gs-text-primary text-[15px] truncate">{s.content || "Photo"}</p>
                  <p className="text-[13px] text-gs-text-secondary">{s.time}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {recent.length > 0 && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Recent updates</p>
          </div>
        )}
        {recent.map((status) => (
          <div key={status.id} onClick={() => openStatus(status)} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gs-hover transition-colors">
            <Ring src={status.avatar} name={status.name} seen={false} />
            <div>
              <p className="font-semibold text-gs-text-primary text-[15px]">{status.name}</p>
              <p className="text-[13px] text-gs-text-secondary">{status.time}</p>
            </div>
          </div>
        ))}

        {seen.length > 0 && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Viewed updates</p>
          </div>
        )}
        {seen.map((status) => (
          <div key={status.id} onClick={() => openStatus(status)} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gs-hover transition-colors">
            <Ring src={status.avatar} name={status.name} seen />
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
