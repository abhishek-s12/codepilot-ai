import { useState } from "react";
import { Folder, Search, Network, Bot, History, Settings, ChevronLeft, ChevronRight, Flame, Sparkles } from "lucide-react";

export default function ActivityBar({
  activeActivity,
  onSelectActivity,
  activeMode,
  onSelectMode,
  rightTab,
  onSelectRightTab,
  onToggleRightSidebar,
  onExecuteQuickAction,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      key: "explorer",
      label: "Explorer",
      icon: Folder,
      isActive: activeActivity === "repository" && activeMode === "editor",
      onClick: () => {
        onSelectActivity("repository");
        onSelectMode("editor");
      },
    },
    {
      key: "search",
      label: "Search",
      icon: Search,
      isActive: activeActivity === "search" && activeMode === "editor",
      onClick: () => {
        onSelectActivity("search");
        onSelectMode("editor");
      },
    },
    {
      key: "graph",
      label: "Graph",
      icon: Network,
      isActive: activeMode === "understand" || activeMode === "trace",
      onClick: () => {
        onSelectMode("understand");
      },
    },
    {
      key: "agents",
      label: "Agents",
      icon: Bot,
      isActive: rightTab === "agents",
      onClick: () => {
        onSelectRightTab("agents");
        onToggleRightSidebar(false); // expand sidebar
      },
    },
    {
      key: "history",
      label: "History",
      icon: History,
      isActive: activeActivity === "history" && activeMode === "editor",
      onClick: () => {
        onSelectActivity("history");
        onSelectMode("editor");
      },
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      isActive: activeActivity === "settings" && activeMode === "editor",
      onClick: () => {
        onSelectActivity("settings");
        onSelectMode("editor");
      },
    },
  ];

  const quickActions = [
    { id: "explain", label: "Explain Code" },
    { id: "generate_tests", label: "Generate Tests" },
    { id: "find_bugs", label: "Find Bugs" },
    { id: "refactor", label: "Refactor" },
  ];

  return (
    <div
      style={{ width: isCollapsed ? "52px" : "150px" }}
      className="shrink-0 bg-[#0c0f16] border-r border-[#1c2230] flex flex-col justify-between select-none py-3 transition-all duration-200 z-20 h-full overflow-hidden"
    >
      {/* Top Menu list */}
      <div className="flex flex-col gap-5 px-2">
        {/* Toggle Collapse */}
        <div className="flex justify-end pr-1 border-b border-[#1c2230]/40 pb-2 mb-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={item.onClick}
                className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all relative ${
                  item.isActive
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#141822] border border-transparent"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="text-[11px] font-semibold font-sans">{item.label}</span>}
                {item.isActive && (
                  <span className="absolute left-0 top-[25%] bottom-[25%] w-[2.5px] bg-indigo-500 rounded-r-md" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle/Bottom panels (Hidden if collapsed) */}
      <div className="flex flex-col gap-4.5 px-2.5">
        {!isCollapsed && (
          <>
            {/* Project Health Card */}
            <div className="bg-[#0f1219]/70 border border-[#1c2230] rounded-xl p-2.5 space-y-1.5 shadow">
              <span className="text-[8px] font-mono font-bold uppercase text-gray-500 tracking-wider block">Project Health</span>
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-white font-sans leading-none">Excellent</span>
                  <span className="text-[8px] text-gray-500 font-mono mt-0.5">100% clean</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono font-bold uppercase text-gray-500 tracking-wider block select-none">Quick Actions</span>
              <div className="flex flex-col gap-1">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onExecuteQuickAction && onExecuteQuickAction(action.id, action.label)}
                    className="w-full text-left p-1.5 rounded-lg border border-[#1c2230] hover:border-indigo-500/20 hover:bg-[#141822] text-[9px] text-gray-400 hover:text-white transition-all font-mono flex items-center gap-1 select-none"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* User context card (Avatar + Info) */}
        <div className="border-t border-[#1c2230]/40 pt-2.5 flex items-center gap-2 select-none overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow border border-[#1c2230]">
            A
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] font-bold text-gray-300 font-sans leading-tight truncate">Abhishek</span>
              <span className="text-[7.5px] font-mono text-indigo-400 uppercase font-bold tracking-wider leading-none mt-0.5">Pro Plan</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
