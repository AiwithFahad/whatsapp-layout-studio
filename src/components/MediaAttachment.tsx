import { X, Image, FileText, Music, Film, Camera } from "lucide-react";

interface MediaAttachmentProps {
  onClose: () => void;
  onSelect: (type: string) => void;
}

const options = [
  { type: "photo", label: "Photos", icon: Image, color: "hsl(var(--gs-green))" },
  { type: "camera", label: "Camera", icon: Camera, color: "hsl(262 83% 58%)" },
  { type: "document", label: "Document", icon: FileText, color: "hsl(217 91% 60%)" },
  { type: "audio", label: "Audio", icon: Music, color: "hsl(25 95% 53%)" },
  { type: "video", label: "Video", icon: Film, color: "hsl(340 82% 52%)" },
];

const MediaAttachment = ({ onClose, onSelect }: MediaAttachmentProps) => (
  <div className="absolute bottom-full left-8 mb-3 bg-card rounded-2xl gs-card-shadow border border-border p-4 animate-fade-in z-50">
    <div className="grid grid-cols-3 gap-4">
      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => { onSelect(opt.type); onClose(); }}
          className="flex flex-col items-center gap-2 group"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: opt.color }}
          >
            <opt.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-[11px] font-medium text-gs-text-secondary">{opt.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default MediaAttachment;
