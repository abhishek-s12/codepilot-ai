import { Search, ChevronDown, CheckCircle } from "lucide-react";

export default function WorkspaceHeader({
  repoPath,
  activeFile,
  onOpenSearch,
  indexingProgress = 85,
  isIndexing = false,
}) {
  const repoName = repoPath ? repoPath.split(/[\\/]/).pop() : "No Repository Opened";
  const fileName = activeFile ? activeFile.split(/[\\/]/).pop() : null;

  return (
    <div className="flex items-center gap-3 px-4 h-11 bg-[#0c0f16] border-b border-[#1c2230] shrink-0 select-none justify-between z-30">
      
      {/* Left side Logo + Repository Selector dropdown */}
      <div className="flex items-center gap-3 select-none">
        {/* Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center shadow shadow-indigo-600/20">
            <span className="text-white text-[9px] font-black">CP</span>
          </div>
          <span className="text-[11px] font-bold text-white font-mono tracking-wider">CodePilot AI</span>
        </div>

        {/* Separator arrow */}
        <span className="text-gray-700 font-mono text-xs">/</span>

        {/* Repository selector dropdown widget */}
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141822] hover:bg-[#1b212f] border border-[#1c2230] text-[10px] text-gray-300 font-mono hover:text-white transition-all cursor-pointer">
          <span>{repoName}</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </button>

        {/* Active file breadcrumb indicator if open */}
        {fileName && (
          <>
            <span className="text-gray-700 font-mono text-xs">›</span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
              {fileName}
            </span>
          </>
        )}
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#090b10] hover:bg-[#141822] border border-[#1c2230] hover:border-indigo-500/20 rounded-xl transition-all text-left text-gray-600 hover:text-gray-500 font-sans cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10.5px] truncate">Search files, symbols, commands...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/8 font-mono text-[9px] text-gray-500 select-none">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right side Indexing Status & Profiler */}
      <div className="flex items-center gap-3">
        {/* Index Status */}
        {isIndexing ? (
          <div className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Indexing {indexingProgress}%
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[9px] uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-xl">
            <CheckCircle className="w-3 h-3" />
            <span>Connected</span>
          </div>
        )}

        {/* Settings / Actions icon triggers */}
        <span className="w-px h-4 bg-[#1c2230]" />

        {/* Profile Avatar */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-[9px] border border-[#1c2230]">
          A
        </div>
      </div>

    </div>
  );
}
