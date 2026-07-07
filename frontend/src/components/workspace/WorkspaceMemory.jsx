import { useState } from "react";
import { Brain, FileText, Bookmark, Pin, Compass, RefreshCw, Sliders } from "lucide-react";
import RepositoryNotes from "./RepositoryNotes";
import Bookmarks from "./Bookmarks";
import PinnedChats from "./PinnedChats";
import KnowledgeBase from "./KnowledgeBase";
import MemoryManager from "./MemoryManager";
import ContextPanel from "./ContextPanel";

export default function WorkspaceMemory({
  onOpenFile,
  onSendMessage,
  onClose,
  repoPath,
  activeFile,
  activeSymbol,
  selectionRange,
  language,
  conversationId,
  isStreaming,
  onSelectTab,
}) {
  const [activeSubTab, setActiveSubTab] = useState("context"); // context | notes | bookmarks | pins | kb | restore

  const tabs = [
    { id: "context", label: "Context", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "notes", label: "Notes", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "bookmarks", label: "Bookmarks", icon: <Bookmark className="w-3.5 h-3.5" /> },
    { id: "pins", label: "Pins", icon: <Pin className="w-3.5 h-3.5" /> },
    { id: "kb", label: "Knowledge", icon: <Compass className="w-3.5 h-3.5" /> },
    { id: "restore", label: "Session", icon: <RefreshCw className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f1219] text-gray-200 border-l border-[#1c2230] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c2230] px-4 py-2.5 bg-[#0c0f16] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">AI Workspace Memory</span>
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
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 py-2 px-1 text-[9px] font-mono font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
              activeSubTab === tab.id
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
      <div className="flex-grow flex-1 overflow-y-auto p-4 scrollbar-thin min-h-0">
        {activeSubTab === "context" && (
          <ContextPanel
            repoPath={repoPath}
            activeFile={activeFile}
            activeSymbol={activeSymbol}
            selectionRange={selectionRange}
            language={language}
            conversationId={conversationId}
            isStreaming={isStreaming}
            onSendMessage={onSendMessage}
            onSelectTab={onSelectTab}
          />
        )}
        {activeSubTab === "notes" && <RepositoryNotes />}
        {activeSubTab === "bookmarks" && <Bookmarks onOpenFile={onOpenFile} />}
        {activeSubTab === "pins" && <PinnedChats />}
        {activeSubTab === "kb" && <KnowledgeBase />}
        {activeSubTab === "restore" && (
          <MemoryManager
            onOpenFile={onOpenFile}
            onTriggerAction={(prompt) => {
              if (onSendMessage) {
                onSendMessage({
                  repo: "",
                  file: "",
                  symbol: "",
                  selection: "",
                  message: prompt,
                });
              }
            }}
          />
        )}
      </div>

    </div>
  );
}
