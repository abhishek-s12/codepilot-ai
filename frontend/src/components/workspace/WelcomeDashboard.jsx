import { Sparkles, Code, Shield, Flame, Play, HelpCircle, FileCode, CheckCircle, Clock, BookOpen, Bug, Search } from "lucide-react";

export default function WelcomeDashboard({
  repoPath,
  filesCount = 0,
  symbolsCount = 0,
  onExecuteAction,
  recentFiles = [],
  onOpenFile,
  recentChats = [],
  onLoadChat,
}) {
  const repoName = repoPath ? repoPath.split(/[/\\]/).pop() : "No Repository Opened";

  const quickActions = [
    {
      id: "explain_repo",
      title: "Explain Repository",
      desc: "Get an AI overview of this codebase and its purpose.",
      icon: BookOpen,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      id: "architecture",
      title: "Generate Architecture",
      desc: "Visualize structural flows and dependency graphs.",
      icon: Code,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      id: "search_repo",
      title: "Search Repository",
      desc: "Run fuzzy and semantic code searches.",
      icon: Search,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      id: "find_bugs",
      title: "Find Bugs",
      desc: "Scan active files for hidden logic errors.",
      icon: Bug,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      id: "generate_tests",
      title: "Generate Tests",
      desc: "Create comprehensive automated unit test suites.",
      icon: Play,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      id: "review",
      title: "Review Code",
      desc: "Perform comprehensive AI audits and quality reviews.",
      icon: Shield,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#090b10] p-6 sm:p-8 select-text scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c2230] pb-6 select-none">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Welcome to <span className="text-indigo-400">CodePilot AI</span>
            </h1>
            <p className="text-xs text-gray-500 font-mono break-all">{repoPath || "Select a folder to begin development..."}</p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">Workspace Ready</span>
          </div>
        </div>

        {/* Overview & Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Repository Overview Card */}
          <div
            onClick={() => onExecuteAction && onExecuteAction("analytics")}
            className="md:col-span-2 bg-[#0f1219] hover:bg-[#141822] border border-[#1c2230] hover:border-indigo-500/25 transition-all rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg cursor-pointer group"
          >
            <div className="space-y-2 select-none">
              <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-[10px] uppercase tracking-wider group-hover:text-indigo-300">
                <FileCode className="w-3.5 h-3.5" />
                <span>Repository Profile (Click for Analytics)</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight font-sans">{repoName}</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                This workspace is fully indexed and analyzed. Use the AI Assistant or select a starting point below to explore the structure and symbols of your project.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-[#1c2230]/40">
              <div>
                <span className="block text-gray-500 font-mono text-[9px] uppercase tracking-wider">Files</span>
                <span className="text-sm font-bold text-white font-mono">{filesCount}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-mono text-[9px] uppercase tracking-wider">Symbols</span>
                <span className="text-sm font-bold text-white font-mono">{symbolsCount}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-mono text-[9px] uppercase tracking-wider">Index Status</span>
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Success</span>
                </span>
              </div>
            </div>
          </div>

          {/* Project Health Score card */}
          <div
            onClick={() => onExecuteAction && onExecuteAction("health")}
            className="bg-[#0f1219] hover:bg-[#141822] border border-[#1c2230] hover:border-emerald-500/25 transition-all rounded-2xl p-5 flex flex-col justify-between items-center shadow-lg text-center select-none cursor-pointer group"
          >
            <div className="w-full text-left flex items-center gap-2 text-emerald-400 font-bold font-mono text-[10px] uppercase tracking-wider border-b border-[#1c2230]/40 pb-2 group-hover:text-emerald-300">
              <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Project Health (Click for Report)</span>
            </div>
            <div className="py-2.5 relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-[5px] border-emerald-500/20 border-t-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-sm font-bold text-white font-mono">100%</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-white">Excellent Health</h3>
              <p className="text-[10px] text-gray-500">No static issues or security alerts detected.</p>
            </div>
          </div>
        </div>

        {/* AI Quick Actions Grid */}
        <div className="space-y-3.5 select-none">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Repository Quick Actions</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onExecuteAction && onExecuteAction(action.id, action.title)}
                  disabled={!repoPath}
                  className="group text-left p-4.5 rounded-2xl bg-[#0f1219] hover:bg-[#141822] border border-[#1c2230] hover:border-indigo-500/30 transition-all shadow-md hover:shadow-indigo-500/5 duration-200 cursor-pointer flex flex-col gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className={`w-9 h-9 rounded-xl ${action.bg} ${action.border} border flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{action.title}</h4>
                    <p className="text-[10px] text-gray-500 leading-normal">{action.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue Working & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Files */}
          <div className="bg-[#0f1219] border border-[#1c2230] rounded-2xl p-4.5 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-[#1c2230]/40 pb-2 select-none">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Recent Files</span>
            </h3>
            <div className="space-y-1 max-h-[180px] overflow-y-auto scrollbar-none">
              {recentFiles.length === 0 ? (
                <p className="text-[10px] text-gray-600 italic py-4 text-center">No files opened recently.</p>
              ) : (
                recentFiles.map((file) => (
                  <button
                    key={file}
                    onClick={() => onOpenFile && onOpenFile(file)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/3 text-[11px] text-gray-400 hover:text-white transition-colors font-mono truncate flex items-center justify-between group"
                  >
                    <span className="truncate">📄 {file.split(/[/\\]/).pop()}</span>
                    <span className="text-[9px] text-gray-600 truncate group-hover:text-gray-400 transition-colors ml-4">{file}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="bg-[#0f1219] border border-[#1c2230] rounded-2xl p-4.5 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-[#1c2230]/40 pb-2 select-none">
              <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
              <span>Recent Chats</span>
            </h3>
            <div className="space-y-1 max-h-[180px] overflow-y-auto scrollbar-none">
              {recentChats.length === 0 ? (
                <p className="text-[10px] text-gray-600 italic py-4 text-center">No recent chats available.</p>
              ) : (
                recentChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onLoadChat && onLoadChat(chat.id)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/3 text-[11px] text-gray-400 hover:text-white transition-colors font-mono truncate flex items-center justify-between group"
                  >
                    <span className="truncate">💬 {chat.title || "Conversation Session"}</span>
                    <span className="text-[9px] text-gray-600 shrink-0 ml-4 group-hover:text-gray-400 transition-colors">
                      {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
