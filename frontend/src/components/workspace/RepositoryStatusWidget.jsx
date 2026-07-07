import { Database, ShieldCheck, AlertTriangle } from "lucide-react";

export default function RepositoryStatusWidget({
  filesCount = 0,
  symbolsCount = 0,
  dependencyNodes = 0,
  circularImportsCount = 0,
  lastIndexing = "Just now",
  isOpen,
  onToggle,
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
          isOpen ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/25" : "hover:bg-white/5 text-gray-400"
        }`}
      >
        <Database className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        <span>Repo Index</span>
        <span className="text-[9px] bg-white/5 text-gray-500 px-1 rounded">{filesCount}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-6 right-16 w-60 bg-[#0c0f16] border border-[#1c2230] rounded-xl shadow-2xl p-3.5 z-50 animate-fade-in font-mono text-[10px] space-y-3 select-none text-left">
          <div className="border-b border-[#1c2230]/40 pb-2 flex justify-between items-center">
            <span className="text-gray-400 font-bold uppercase tracking-wider">Repository Index Database</span>
            <span className="text-[8.5px] bg-[#1c2230] text-gray-400 px-1.5 py-0.2 rounded border border-[#2d3748] font-bold">LDB</span>
          </div>

          <div className="space-y-1.5 text-gray-500">
            <div className="flex justify-between">
              <span>Indexed Files:</span>
              <span className="text-white font-bold">{filesCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Indexed Symbols:</span>
              <span className="text-white font-bold">{symbolsCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Dependency Edges:</span>
              <span className="text-white font-bold">{dependencyNodes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Circular Imports:</span>
              <span className={circularImportsCount > 0 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                {circularImportsCount} detected
              </span>
            </div>
            <div className="flex justify-between border-t border-[#1c2230]/30 pt-1.5 mt-1">
              <span>Last Workspace Scan:</span>
              <span className="text-gray-300 font-bold">{lastIndexing}</span>
            </div>
          </div>

          {circularImportsCount > 0 ? (
            <div className="p-2 rounded bg-amber-500/5 border border-amber-500/15 text-amber-400 text-[9px] flex gap-1.5 items-start">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Circular Dependencies</span>
                <p className="text-gray-500 mt-0.2 font-sans">Check 'Analytics' dashboard for circular import diagnostic resolutions.</p>
              </div>
            </div>
          ) : (
            <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 text-[9px] flex gap-1.5 items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold">Index Integrity Verified</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
