import { MessageSquare } from "lucide-react";

const EmptyChatView = () => (
  <div className="flex flex-col items-center justify-center h-full gs-chat-pattern">
    <div className="text-center space-y-6 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-gs-green-light mx-auto flex items-center justify-center gs-bubble-shadow">
        <MessageSquare className="w-10 h-10 text-gs-green" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gs-text-primary tracking-tight">GhupShup Web</h2>
        <p className="text-sm text-gs-text-secondary mt-2 max-w-sm leading-relaxed">
          Send and receive messages seamlessly. Your conversations are end-to-end encrypted.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-[11px] text-gs-text-secondary font-medium uppercase tracking-wider">
        <span>🔒</span>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  </div>
);

export default EmptyChatView;
