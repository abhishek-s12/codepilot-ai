import { GitBranch, GitCommit, AlertTriangle, CloudIcon } from "lucide-react";

export default function GitStatusWidget({ gitStatus = {}, isOpen, onToggle }) {
  const branch = gitStatus?.active_branch || "main";
  const modifiedCount = gitStatus?.modified_files?.length || 0;
  const stagedCount = gitStatus?.staged_files?.length || 0;
  const pendingCommits = gitStatus?.pending_commits || 0;
  const conflictsCount = gitStatus?.conflicts?.length || 0;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
          conflictsCount > 0
            ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25"
            : modifiedCount > 0
            ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25"
            : "hover:bg-white/5 text-gray-400"
        }`}
      >
        <GitBranch className="w-3 h-3 text-indigo-400 shrink-0" />
        <span>{branch}</span>
        {modifiedCount > 0 && <span className="text-[9px] opacity-75">({modifiedCount}M)</span>}
        {conflictsCount > 0 && (
          <span className="flex items-center gap-0.5 text-[9px] text-rose-400 font-bold bg-rose-500/10 px-1 rounded animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" /> {conflictsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-6 left-0 w-64 bg-[#0c0f16] border border-[#1c2230] rounded-xl shadow-2xl p-3 z-50 animate-fade-in font-mono text-[10px] space-y-3 select-none text-left">
          <div className="border-b border-[#1c2230]/40 pb-2 flex justify-between items-center">
            <span className="text-gray-400 font-bold uppercase tracking-wider">Git Status Workspace</span>
            <span className="text-indigo-400 font-bold text-[9px]">{branch}</span>
          </div>

          <div className="space-y-1.5 text-gray-500">
            <div className="flex justify-between">
              <span>Staged Changes:</span>
              <span className="text-emerald-400 font-bold">{stagedCount} files</span>
            </div>
            <div className="flex justify-between">
              <span>Modified Changes:</span>
              <span className="text-amber-400 font-bold">{modifiedCount} files</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <GitCommit className="w-3 h-3 text-indigo-400" /> Pending Commits:
              </span>
              <span className="text-white font-bold">{pendingCommits}</span>
            </div>
            <div className="flex justify-between border-t border-[#1c2230]/30 pt-1.5 mt-1">
              <span className="flex items-center gap-1">
                <CloudIcon className="w-3 h-3 text-cyan-400" /> Sync Status:
              </span>
              <span className="text-emerald-400 font-bold">Synchronized</span>
            </div>
          </div>

          {gitStatus?.modified_files?.length > 0 && (
            <div className="space-y-1 pt-1.5 border-t border-[#1c2230]/30">
              <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Uncommitted Files</span>
              <div className="max-h-20 overflow-y-auto space-y-1 scrollbar-thin pr-1">
                {gitStatus.modified_files.map((file, idx) => (
                  <div key={idx} className="truncate text-amber-500 hover:text-amber-400 transition-colors">
                    • {file.split(/[/\\]/).pop()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {conflictsCount > 0 && (
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] leading-relaxed">
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" /> Merge Conflicts Detected
              </span>
              <p className="mt-0.5 text-gray-500 font-sans">Resolve conflict markers inside conflicting files before pushing commits.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
