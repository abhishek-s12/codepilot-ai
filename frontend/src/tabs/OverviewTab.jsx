import { IconFolder, IconArrowRight, IconSparkles } from "../components/icons/Icons";

const sampleQuestions = [
  "Which files contain the main API routes?",
  "Explain the structure of the RAG assistant implementation.",
  "How are function calls extracted and resolved in the call graph?",
  "What is the entry point of the FastAPI application?",
];

export default function OverviewTab({ metrics, onGetArchitecture, onGetCallGraph, onGetFlow, onSetActiveTab, onAskQuestion }) {
  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <IconFolder className="w-6 h-6 text-indigo-400" /> Repository Overview
        </h2>
        <p className="mt-1 text-sm text-soft leading-relaxed">
          Workspace index completed. Select one of the primary workflows below or run assistant prompts.
        </p>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Index Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-white text-md font-semibold font-mono">INDEXED_READY</span>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Source Code Files</span>
          <span className="text-white text-xl font-bold font-mono mt-1 block">{metrics.filesIndexed}</span>
        </div>
        <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Language Scope</span>
          <span className="text-white text-xl font-bold font-mono mt-1 block">Multi-language</span>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
        <h3 className="text-sm font-semibold text-indigo-300 mb-3">Quick Navigation Tasks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-300">
          <button onClick={onGetArchitecture} className="p-3.5 rounded-xl border border-white/5 bg-black/20 hover:bg-black/30 text-left hover:border-indigo-500/20 transition-all flex items-center justify-between">
            <span>Generate Architecture &amp; Dependency Graph</span>
            <IconArrowRight className="w-3.5 h-3.5 text-indigo-400" />
          </button>
          <button onClick={onGetCallGraph} className="p-3.5 rounded-xl border border-white/5 bg-black/20 hover:bg-black/30 text-left hover:border-purple-500/20 transition-all flex items-center justify-between">
            <span>Map Code Call Mappings</span>
            <IconArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </button>
          <button onClick={onGetFlow} className="p-3.5 rounded-xl border border-white/5 bg-black/20 hover:bg-black/30 text-left hover:border-emerald-500/20 transition-all flex items-center justify-between">
            <span>Trace Execution Pipelines</span>
            <IconArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button onClick={() => onSetActiveTab("chat")} className="p-3.5 rounded-xl border border-white/5 bg-black/20 hover:bg-black/30 text-left hover:border-amber-500/20 transition-all flex items-center justify-between">
            <span>Start Codebase Conversation</span>
            <IconArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div>
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
          <IconSparkles className="w-3.5 h-3.5 text-indigo-400" /> Suggested Prompts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestion(q)}
              className="p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 text-left text-xs text-gray-400 hover:text-white transition-all duration-200 block"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
