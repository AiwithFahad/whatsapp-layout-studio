import { useRef } from "react";
import { Image, FileText, Music, Film, Camera, X } from "lucide-react";
import type { AttachmentType } from "@/data/chatData";

interface MediaAttachmentProps {
  onClose: () => void;
  onFileSelect: (file: File, type: AttachmentType) => void;
}

const options: { type: AttachmentType; label: string; icon: typeof Image; color: string; accept: string }[] = [
  { type: "image", label: "Photos", icon: Image, color: "hsl(var(--gs-green))", accept: "image/*" },
  { type: "video", label: "Video", icon: Film, color: "hsl(340 82% 52%)", accept: "video/*" },
  { type: "document", label: "Document", icon: FileText, color: "hsl(217 91% 60%)", accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" },
  { type: "audio", label: "Audio", icon: Music, color: "hsl(25 95% 53%)", accept: "audio/*" },
];

const MediaAttachment = ({ onClose, onFileSelect }: MediaAttachmentProps) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleClick = (type: AttachmentType) => {
    inputRefs.current[type]?.click();
  };

  const handleChange = (type: AttachmentType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file, type);
      onClose();
    }
    e.target.value = "";
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Create a quick capture via video element
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      await new Promise((r) => { video.onloadeddata = r; });
      await new Promise((r) => setTimeout(r, 300)); // brief settle

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")!.drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
          onFileSelect(file, "image");
          onClose();
        }
      }, "image/jpeg", 0.9);
    } catch {
      // Camera not available — fall back to file picker
      inputRefs.current["image"]?.click();
    }
  };

  return (
    <div className="absolute bottom-full left-8 mb-3 bg-card rounded-2xl gs-card-shadow border border-border p-4 animate-fade-in z-50">
      <div className="grid grid-cols-3 gap-4">
        {options.map((opt) => (
          <button
            key={opt.type}
            onClick={() => handleClick(opt.type)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: opt.color }}
            >
              <opt.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[11px] font-medium text-gs-text-secondary">{opt.label}</span>
            <input
              ref={(el) => { inputRefs.current[opt.type] = el; }}
              type="file"
              accept={opt.accept}
              className="hidden"
              onChange={(e) => handleChange(opt.type, e)}
            />
          </button>
        ))}
        {/* Camera option */}
        <button onClick={handleCamera} className="flex flex-col items-center gap-2 group">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: "hsl(262 83% 58%)" }}
          >
            <Camera className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-[11px] font-medium text-gs-text-secondary">Camera</span>
        </button>
      </div>
    </div>
  );
};

export default MediaAttachment;
