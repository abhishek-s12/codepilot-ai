import { Sparkles, Code, Search, Clock, GitBranch } from "lucide-react";

export default function EmptyState({
  type = "welcome", // welcome | chat | search | graph | onboarding
  filesCount = 0,
  recentFiles = [],
  recentSearches = [],
  onAction = () => {},
  onOpenFile = () => {},
}) {

  switch (type) {
    case "welcome":
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto h-full space-y-6 select-none animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center">
            <Code className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white font-sans">No File Open</h3>
            <p className="text-[11px] text-gray-500 font-sans max-w-sm leading-relaxed">
              Select a file from the Explorer sidebar, query files globally, or let the AI scan your directory structure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
            <button
              onClick={() => onAction("trigger_explorer")}
              className="p-3 text-left rounded-xl bg-[#0f1219] hover:bg-[#141822] border border-[#1c2230] text-gray-300 hover:text-white transition-all flex items-center gap-2.5 font-mono text-[10px]"
            >
              <span className="text-xs">📁</span> Select from Explorer
            </button>
            <button
              onClick={() => onAction("trigger_search")}
              className="p-3 text-left rounded-xl bg-[#0f1219] hover:bg-[#141822] border border-[#1c2230] text-gray-300 hover:text-white transition-all flex items-center gap-2.5 font-mono text-[10px]"
            >
              <span className="text-xs">🔍</span> Search Repository
            </button>
          </div>

          {recentFiles.length > 0 && (
            <div className="w-full text-left space-y-2 pt-4 border-t border-[#1c2230]/40">
              <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500" /> Recent Files
              </span>
              <div className="space-y-1 max-h-[140px] overflow-y-auto">
                {recentFiles.slice(0, 3).map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenFile(file)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0f1219] hover:bg-white/3 text-[10px] font-mono text-gray-400 hover:text-white transition-all"
                  >
                    <span>📄 {file.split(/[/\\]/).pop()}</span>
                    <span className="text-[8.5px] text-gray-600 truncate max-w-[150px]">{file}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "chat":
      return (
        <div className="space-y-5 p-4 select-none text-left animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">👋</span>
              <h3 className="text-xs font-bold text-white font-sans">Hi, how can I help?</h3>
            </div>
            <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
              I am your workspace context assistant. You can ask code analysis queries directly.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[9px] font-mono font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1 border-b border-[#1c2230]/40 pb-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> Try Starter Queries
            </span>
            <div className="grid grid-cols-1 gap-2">
              {[
                { title: "Explain this repository", prompt: "Explain the architecture, main packages, and module separation in this repository." },
                { title: "Generate architecture report", prompt: "Provide a detailed documentation of the layout and dependency paths in this codebase." },
                { title: "Find API routes & entry", prompt: "Where are the API routes, controllers, or main endpoints defined?" },
                { title: "Review codebase security", prompt: "Audit active files for hardcoded secrets, injection vulnerabilities, and weak patterns." },
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onAction("prompt", q.prompt)}
                  className="p-3 text-left rounded-xl bg-[#141822] hover:bg-[#1b212f] border border-[#1c2230] text-gray-300 hover:text-white hover:border-indigo-500/25 transition-all text-[10px] font-sans font-medium flex items-center justify-between group"
                >
                  <span>{q.title}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case "search":
      return (
        <div className="p-4 space-y-5 animate-fade-in text-left select-none">
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-gray-500" /> Search Workspace
            </h3>
            <p className="text-[10px] text-gray-500">Query symbols, functions, or text matches globally across this project.</p>
          </div>

          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest font-mono">Recent Searches</span>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAction("search", s)}
                    className="px-2 py-1 rounded bg-[#141822] hover:bg-[#1b212f] border border-[#1c2230] text-[9.5px] text-gray-400 font-mono transition-colors"
                  >
                    🔍 {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-[#1c2230]/40">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest font-mono">Suggested Targets</span>
            <div className="grid grid-cols-2 gap-2">
              {["class declarations", "async routes", "database configurations", "authentication hooks"].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onAction("search", item)}
                  className="p-2 text-left bg-[#0f1219] hover:bg-[#141822] border border-[#1c2230] rounded-lg text-[9.5px] text-gray-400 hover:text-white transition-all font-mono"
                >
                  • {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case "graph":
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto h-[480px] space-y-5 select-none animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center animate-pulse">
            <GitBranch className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white font-sans">Generate Dependency Graph</h3>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Visualize class extensions, imports, and functional caller paths. Understand how changes cascade through packages in minutes.
            </p>
          </div>
          <button
            onClick={() => onAction("generate_graph")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs font-mono shadow-lg shadow-indigo-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Generate Repository Graph
          </button>
        </div>
      );

    case "onboarding":
      return (
        <div className="bg-[#0f1219] border border-[#1c2230] rounded-2xl p-6 space-y-5 max-w-xl mx-auto shadow-2xl text-left select-none animate-fade-in">
          <div className="flex items-center gap-3 border-b border-[#1c2230]/40 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg">
              🎉
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Repository Indexing Complete!</h3>
              <p className="text-[10px] text-gray-500 font-mono">indexed {filesCount} files successfully</p>
            </div>
          </div>

          <div className="space-y-2 text-gray-300 font-sans text-xs">
            <p className="text-gray-400 leading-relaxed">
              CodePilot AI has mapped local classes, modules, functions, and import paths. You are ready to develop with AIcontext:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-gray-400">
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Explain complex code</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Scan for vulnerabilities</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Generate unit tests</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Graph module paths</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2230]/40 flex justify-end gap-3 font-mono">
            <button
              onClick={() => onAction("explain_repo")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Explain Repository
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
