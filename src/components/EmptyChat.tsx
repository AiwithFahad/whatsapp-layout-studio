import { Lock } from "lucide-react";

const EmptyChat = () => (
  <div className="flex flex-col items-center justify-center h-full wa-chat-pattern">
    <div className="text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-wa-msg-in mx-auto flex items-center justify-center">
        <svg viewBox="0 0 303 172" width="200" className="text-muted-foreground opacity-40">
          <path
            fill="currentColor"
            d="M229.565 160.229c32.647-20.565 45.642-59.052 31.424-93.567C247.009 33.146 213.397 12.652 176.385 6.4 139.374.148 101.283 9.67 72.88 31.674 44.478 53.677 28.533 85.487 27.423 119.18c-.478 14.508 2.362 29.058 8.502 42.47l-8.818 28.604a8.022 8.022 0 009.903 10.14l28.004-8.163a118.092 118.092 0 0054.572 9.17c42.017-1.122 81.328-20.607 109.979-41.172z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-light text-foreground">WhatsApp Web</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Send and receive messages without keeping your phone online.
      </p>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-8">
        <Lock className="w-3 h-3" />
        <span>End-to-end encrypted</span>
      </div>
    </div>
  </div>
);

export default EmptyChat;
