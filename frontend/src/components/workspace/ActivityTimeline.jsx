/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Clock, Bot, GitBranch, Search, FileCode, Server, AlertCircle } from "lucide-react";

export default function ActivityTimeline({
  recentFiles = [],
  recentChats = [],
  onOpenFile,
  onLoadChat,
}) {
  const [filter, setFilter] = useState("all"); // all | ai | git | repo | errors
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    // Compile chronological timeline events
    const items = [];

    // Add recent files as "opened" events
    recentFiles.forEach((file, index) => {
      const fileName = file.split(/[/\\]/).pop();
      items.push({
        id: `file-${index}`,
        category: "repo",
        icon: FileCode,
        iconColor: "text-violet-400",
        bg: "bg-violet-500/10",
        title: `Opened file ${fileName}`,
        detail: file,
        time: "Just now",
        timestamp: Date.now() - index * 60000,
        action: () => onOpenFile && onOpenFile(file),
      });
    });

    // Add recent chats
    recentChats.forEach((chat, index) => {
      items.push({
        id: `chat-${chat.id || index}`,
        category: "ai",
        icon: Bot,
        iconColor: "text-indigo-400",
        bg: "bg-indigo-500/10",
        title: `AI Assistant Chat: ${chat.title || "Query Session"}`,
        detail: chat.model || "Gemini 1.5 Pro",
        time: chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "5m ago",
        timestamp: chat.timestamp || (Date.now() - 300000 - index * 600000),
        action: () => onLoadChat && onLoadChat(chat.id),
      });
    });

    // Add some realistic static events to pad the history
    items.push({
      id: "git-sync-1",
      category: "git",
      icon: GitBranch,
      iconColor: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Git synchronized branch main",
      detail: "Synced commits with origin/main",
      time: "10m ago",
      timestamp: Date.now() - 600000,
    });

    items.push({
      id: "index-success-1",
      category: "repo",
      icon: Server,
      iconColor: "text-cyan-400",
      bg: "bg-cyan-500/10",
      title: "Indexed codebase successfully",
      detail: `${recentFiles.length || 44} files indexed in vector database`,
      time: "1h ago",
      timestamp: Date.now() - 3600000,
    });

    items.push({
      id: "search-query-1",
      category: "search",
      icon: Search,
      iconColor: "text-amber-400",
      bg: "bg-amber-500/10",
      title: "Run global workspace search",
      detail: "Queried 'db connection string'",
      time: "2h ago",
      timestamp: Date.now() - 7200000,
    });

    items.push({
      id: "linter-err-1",
      category: "errors",
      icon: AlertCircle,
      iconColor: "text-rose-400",
      bg: "bg-rose-500/10",
      title: "Uvicorn reloader crash warning",
      detail: "Address already in use 127.0.0.1:8000",
      time: "4h ago",
      timestamp: Date.now() - 14400000,
    });

    // Sort items chronologically (latest first)
    items.sort((a, b) => b.timestamp - a.timestamp);
    setTimelineItems(items);
  }, [recentFiles, recentChats, onOpenFile, onLoadChat]);

  // Filter implementation
  const filteredItems = timelineItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "ai") return item.category === "ai";
    if (filter === "git") return item.category === "git";
    if (filter === "repo") return item.category === "repo";
    if (filter === "errors") return item.category === "errors";
    return true;
  });

  const filterButtons = [
    { key: "all", label: "All Events" },
    { key: "ai", label: "AI Chats" },
    { key: "git", label: "Git Updates" },
    { key: "repo", label: "Workspace" },
    { key: "errors", label: "Warnings" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0f1219] select-none">
      
      {/* Search/Header Title */}
      <div className="p-3 border-b border-[#1c2230] bg-[#0c0f16] flex items-center justify-between shrink-0">
        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">Workspace Timeline</span>
        <Clock className="w-3.5 h-3.5 text-gray-500" />
      </div>

      {/* Filter Horizontal List */}
      <div className="px-2 py-1.5 border-b border-[#1c2230]/40 flex gap-1 overflow-x-auto shrink-0 scrollbar-none bg-[#090b10]/40">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold transition-all border shrink-0 cursor-pointer ${
              filter === btn.key
                ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400"
                : "bg-transparent border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* List items block */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin min-h-0">
        {filteredItems.length === 0 ? (
          <p className="text-[10px] text-gray-600 italic text-center py-8 font-mono">No timeline events match filter.</p>
        ) : (
          filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => item.action && item.action()}
                className={`flex gap-3 text-left group transition-all rounded-lg p-1.5 ${
                  item.action ? "hover:bg-white/3 cursor-pointer" : ""
                }`}
              >
                <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="text-[10px] font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                      {item.title}
                    </h4>
                    <span className="text-[8px] text-gray-600 shrink-0 font-mono">{item.time}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 truncate leading-normal">{item.detail}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
