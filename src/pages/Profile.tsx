import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft, Camera, User, Shield, Lock, MessageSquare, Bell, Keyboard, HelpCircle, LogOut,
  ChevronRight, Moon, Palette, Globe, Eye, Clock, Trash2, Volume2, Smartphone, Mail
} from "lucide-react";

type Section = "main" | "account" | "privacy" | "chats" | "notifications" | "help";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [section, setSection] = useState<Section>("main");
  const [editingName, setEditingName] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [nameValue, setNameValue] = useState(user.name);
  const [aboutValue, setAboutValue] = useState(user.about);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const saveName = () => {
    if (nameValue.trim()) {
      updateProfile({ name: nameValue.trim() });
      setEditingName(false);
    }
  };

  const saveAbout = () => {
    updateProfile({ about: aboutValue.trim() });
    setEditingAbout(false);
  };

  const MenuItem = ({ icon: Icon, label, desc, onClick, destructive }: {
    icon: any; label: string; desc?: string; onClick?: () => void; destructive?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gs-hover transition-colors text-left ${destructive ? "text-destructive" : ""}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${destructive ? "text-destructive" : "text-gs-text-secondary"}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium ${destructive ? "text-destructive" : "text-gs-text-primary"}`}>{label}</p>
        {desc && <p className="text-[13px] text-gs-text-secondary truncate">{desc}</p>}
      </div>
      {!destructive && <ChevronRight className="w-4 h-4 text-gs-text-secondary flex-shrink-0" />}
    </button>
  );

  const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 px-5 py-4 gs-header-shadow">
      <button onClick={onBack} className="text-gs-text-secondary hover:text-gs-text-primary transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-[20px] font-bold text-gs-text-primary">{title}</h1>
    </div>
  );

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-gs-green" : "bg-gs-divider"}`}
    >
      <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow-md transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );

  const ToggleItem = ({ label, desc, defaultOn = false }: { label: string; desc?: string; defaultOn?: boolean }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div className="flex items-center justify-between px-5 py-3.5">
        <div>
          <p className="text-[15px] font-medium text-gs-text-primary">{label}</p>
          {desc && <p className="text-[13px] text-gs-text-secondary">{desc}</p>}
        </div>
        <Toggle enabled={on} onToggle={() => setOn(!on)} />
      </div>
    );
  };

  if (section === "account") {
    return (
      <div className="flex flex-col h-full bg-card">
        <SectionHeader title="Account" onBack={() => setSection("main")} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <MenuItem icon={Shield} label="Security Notifications" desc="Get notified about security changes" />
          <MenuItem icon={Mail} label="Email Address" desc={user.email} />
          <MenuItem icon={Smartphone} label="Phone Number" desc={user.phone} />
          <MenuItem icon={Lock} label="Change Password" desc="Update your account password" />
          <MenuItem icon={Clock} label="Login Activity" desc="View recent login history" />
          <div className="border-t border-gs-divider my-2" />
          <MenuItem icon={Trash2} label="Delete Account" desc="Permanently delete your account" destructive />
        </div>
      </div>
    );
  }

  if (section === "privacy") {
    return (
      <div className="flex flex-col h-full bg-card">
        <SectionHeader title="Privacy" onBack={() => setSection("main")} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-5 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Visibility</p>
          </div>
          <MenuItem icon={Eye} label="Last Seen" desc="Everyone" />
          <MenuItem icon={User} label="Profile Photo" desc="My Contacts" />
          <MenuItem icon={Globe} label="About" desc="Everyone" />
          <div className="border-t border-gs-divider my-2" />
          <div className="px-5 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Messaging</p>
          </div>
          <MenuItem icon={Lock} label="Blocked Contacts" desc="3 contacts blocked" />
          <MenuItem icon={Clock} label="Disappearing Messages" desc="Off" />
          <ToggleItem label="Read Receipts" desc="Send and receive read receipts" defaultOn={true} />
        </div>
      </div>
    );
  }

  if (section === "chats") {
    return (
      <div className="flex flex-col h-full bg-card">
        <SectionHeader title="Chats" onBack={() => setSection("main")} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-5 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Display</p>
          </div>
          <MenuItem icon={Moon} label="Theme" desc="System Default" />
          <MenuItem icon={Palette} label="Chat Wallpaper" desc="Default" />
          <ToggleItem label="Enter to Send" desc="Use Enter key to send messages" defaultOn={true} />
          <div className="border-t border-gs-divider my-2" />
          <div className="px-5 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Media</p>
          </div>
          <ToggleItem label="Auto-download Media" desc="Automatically download photos and videos" defaultOn={false} />
          <ToggleItem label="Chat Backup" desc="Back up messages to cloud" defaultOn={true} />
        </div>
      </div>
    );
  }

  if (section === "notifications") {
    return (
      <div className="flex flex-col h-full bg-card">
        <SectionHeader title="Notifications" onBack={() => setSection("main")} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-5 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Messages</p>
          </div>
          <ToggleItem label="Message Notifications" desc="Show notifications for new messages" defaultOn={true} />
          <MenuItem icon={Volume2} label="Notification Tone" desc="Default" />
          <ToggleItem label="Vibrate" desc="Vibrate on new message" defaultOn={true} />
          <div className="border-t border-gs-divider my-2" />
          <div className="px-5 pt-4 pb-2">
            <p className="text-[13px] font-semibold text-gs-text-secondary uppercase tracking-wider">Groups</p>
          </div>
          <ToggleItem label="Group Notifications" desc="Show notifications for group messages" defaultOn={true} />
          <MenuItem icon={Volume2} label="Group Tone" desc="Default" />
          <div className="border-t border-gs-divider my-2" />
          <ToggleItem label="Desktop Notifications" desc="Show notifications on desktop" defaultOn={true} />
          <ToggleItem label="Sound" desc="Play sound for notifications" defaultOn={true} />
        </div>
      </div>
    );
  }

  if (section === "help") {
    return (
      <div className="flex flex-col h-full bg-card">
        <SectionHeader title="Help" onBack={() => setSection("main")} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <MenuItem icon={HelpCircle} label="Help Center" desc="Get help, contact us" />
          <MenuItem icon={MessageSquare} label="Contact Support" desc="Chat with our support team" />
          <MenuItem icon={Shield} label="Privacy Policy" desc="Read our privacy policy" />
          <MenuItem icon={Globe} label="Terms of Service" desc="Read terms and conditions" />
          <MenuItem icon={Mail} label="Send Feedback" desc="Help us improve GhupShup" />
          <div className="border-t border-gs-divider my-2" />
          <div className="px-5 py-4 text-center">
            <p className="text-[13px] text-gs-text-secondary">GhupShup v1.0.0</p>
            <p className="text-[11px] text-gs-text-secondary mt-1">Made with ❤️ by Rehan</p>
          </div>
        </div>
      </div>
    );
  }

  // Main profile page
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center gap-3 px-5 py-4 gs-header-shadow">
        <button onClick={() => navigate("/")} className="text-gs-text-secondary hover:text-gs-text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[20px] font-bold text-gs-text-primary">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Profile header */}
        <div className="flex items-center gap-4 px-5 py-5">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full gs-avatar-3d object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gs-green flex items-center justify-center gs-avatar-3d text-primary-foreground text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gs-green flex items-center justify-center border-2 border-card">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="flex-1 bg-gs-search rounded-lg px-3 py-1.5 text-sm text-gs-text-primary outline-none gs-input-shadow"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                />
                <button onClick={saveName} className="text-gs-green text-sm font-semibold">Save</button>
              </div>
            ) : (
              <p
                className="font-bold text-[18px] text-gs-text-primary cursor-pointer hover:text-gs-green transition-colors"
                onClick={() => setEditingName(true)}
              >
                {user.name}
              </p>
            )}
            <p className="text-[13px] text-gs-text-secondary mt-0.5">{user.phone}</p>
          </div>
        </div>

        {/* About */}
        <div className="px-5 pb-4 border-b border-gs-divider">
          <p className="text-[11px] font-semibold text-gs-text-secondary uppercase tracking-wider mb-1">About</p>
          {editingAbout ? (
            <div className="flex gap-2">
              <input
                value={aboutValue}
                onChange={(e) => setAboutValue(e.target.value)}
                className="flex-1 bg-gs-search rounded-lg px-3 py-1.5 text-sm text-gs-text-primary outline-none gs-input-shadow"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveAbout()}
              />
              <button onClick={saveAbout} className="text-gs-green text-sm font-semibold">Save</button>
            </div>
          ) : (
            <p
              className="text-[14px] text-gs-text-primary cursor-pointer hover:text-gs-green transition-colors"
              onClick={() => setEditingAbout(true)}
            >
              {user.about}
            </p>
          )}
        </div>

        {/* Menu items */}
        <div className="mt-2">
          <MenuItem icon={User} label="Account" desc="Security, change number, delete account" onClick={() => setSection("account")} />
          <MenuItem icon={Lock} label="Privacy" desc="Blocked contacts, disappearing messages" onClick={() => setSection("privacy")} />
          <MenuItem icon={MessageSquare} label="Chats" desc="Theme, wallpaper, chat backup" onClick={() => setSection("chats")} />
          <MenuItem icon={Bell} label="Notifications" desc="Messages, groups, tones" onClick={() => setSection("notifications")} />
          <MenuItem icon={Keyboard} label="Keyboard Shortcuts" desc="View available shortcuts" />
          <MenuItem icon={HelpCircle} label="Help" desc="Help center, contact us, privacy policy" onClick={() => setSection("help")} />
        </div>

        <div className="border-t border-gs-divider mt-2">
          <MenuItem icon={LogOut} label="Log Out" desc="Sign out of your account" onClick={handleLogout} destructive />
        </div>
      </div>
    </div>
  );
};

export default Profile;
