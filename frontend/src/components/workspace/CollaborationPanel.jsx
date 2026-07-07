import { useState } from "react";
import { Users, Globe, Download, Bell, MessageSquare } from "lucide-react";
import ShareWorkspace from "./ShareWorkspace";
import ReportGenerator from "./ReportGenerator";
import ExportManager from "./ExportManager";
import CommentSystem from "./CommentSystem";
import NotificationCenter from "./NotificationCenter";

export default function CollaborationPanel({ activeFile, onClose }) {
  const [collabTab, setCollabTab] = useState("share"); // share | comments | alerts | reports | exports

  const tabs = [
    { id: "share", label: "Share", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "comments", label: "Comments", icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="w-3.5 h-3.5" /> },
    { id: "reports", label: "Reports", icon: <Download className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f1219] text-gray-200 border-l border-[#1c2230] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c2230] px-4 py-2.5 bg-[#0c0f16] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Collaboration Studio</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 cursor-pointer"
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
            onClick={() => setCollabTab(tab.id)}
            className={`flex-1 py-2 px-1 text-[9px] font-mono font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
              collabTab === tab.id
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
        {collabTab === "share" && <ShareWorkspace />}
        {collabTab === "comments" && <CommentSystem activeFile={activeFile} />}
        {collabTab === "alerts" && <NotificationCenter />}
        {collabTab === "reports" && (
          <div className="space-y-4">
            <ReportGenerator />
            <ExportManager />
          </div>
        )}
      </div>

    </div>
  );
}
