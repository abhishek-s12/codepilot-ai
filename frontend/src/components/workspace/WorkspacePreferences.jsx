import { useState } from "react";
import { Settings, Sparkles, Layout, Keyboard, ShieldAlert } from "lucide-react";
import ThemeManager from "./ThemeManager";
import LayoutManager from "./LayoutManager";
import KeyboardShortcutPanel from "./KeyboardShortcutPanel";
import WorkspaceProfiles from "./WorkspaceProfiles";

export default function WorkspacePreferences({ onApplyProfile, onClose }) {
  const [prefTab, setPrefTab] = useState("theme"); // theme | layout | shortcuts | profiles

  const tabs = [
    { id: "theme", label: "Themes", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "layout", label: "Layouts", icon: <Layout className="w-3.5 h-3.5" /> },
    { id: "shortcuts", label: "Shortcuts", icon: <Keyboard className="w-3.5 h-3.5" /> },
    { id: "profiles", label: "Profiles", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f1219] text-gray-200 border-l border-[#1c2230] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c2230] px-4 py-2.5 bg-[#0c0f16] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Preferences Panel</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1c2230]/40 bg-[#0c0f16]/40 shrink-0 select-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPrefTab(tab.id)}
            className={`flex-1 py-2 px-1 text-[9px] font-mono font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
              prefTab === tab.id
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/3"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin min-h-0">
        {prefTab === "theme" && <ThemeManager />}
        {prefTab === "layout" && <LayoutManager />}
        {prefTab === "shortcuts" && <KeyboardShortcutPanel />}
        {prefTab === "profiles" && (
          <WorkspaceProfiles onApplyProfile={onApplyProfile} />
        )}
      </div>

    </div>
  );
}
