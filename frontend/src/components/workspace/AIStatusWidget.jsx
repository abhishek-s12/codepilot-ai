import { Cpu, DollarSign, RefreshCw, BarChart2 } from "lucide-react";

export default function AIStatusWidget({
  activeModel = "Gemini 1.5 Pro",
  provider = "Google OpenRouter",
  contextLimit = "2,000,000",
  promptTokens = 12450,
  completionTokens = 3840,
  activeTask = null,
  isOpen,
  onToggle,
}) {
  const totalTokens = promptTokens + completionTokens;
  const estimatedCost = ((promptTokens * 0.0015 + completionTokens * 0.002) / 1000).toFixed(5);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
          isOpen ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/25" : "hover:bg-white/5 text-gray-400"
        }`}
      >
        <Cpu className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>{activeModel}</span>
        {activeTask && (
          <span className="flex items-center gap-1 text-[9px] text-indigo-400 animate-pulse bg-indigo-500/10 px-1.5 py-0.2 rounded font-mono font-semibold ml-1">
            <RefreshCw className="w-2 h-2 animate-spin" /> {activeTask}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-6 right-0 w-64 bg-[#0c0f16] border border-[#1c2230] rounded-xl shadow-2xl p-3.5 z-50 animate-fade-in font-mono text-[10px] space-y-3.5 select-none text-left">
          <div className="border-b border-[#1c2230]/40 pb-2 flex justify-between items-center">
            <span className="text-gray-400 font-bold uppercase tracking-wider">AI Intelligence Status</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-bold">ACTIVE</span>
          </div>

          <div className="space-y-2 text-gray-500">
            <div className="flex justify-between">
              <span>Model Provider:</span>
              <span className="text-white font-bold">{provider}</span>
            </div>
            <div className="flex justify-between">
              <span>Context Limit:</span>
              <span className="text-white font-bold">{contextLimit} tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Prompt Tokens:</span>
              <span className="text-gray-300 font-bold">{promptTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Completion Tokens:</span>
              <span className="text-gray-300 font-bold">{completionTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#1c2230]/30 pt-2 mt-1.5">
              <span className="flex items-center gap-0.5 text-gray-400">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" /> Total Tokens:
              </span>
              <span className="text-indigo-400 font-bold">{totalTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-0.5 text-gray-400">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Estimated Cost:
              </span>
              <span className="text-emerald-400 font-bold">${estimatedCost}</span>
            </div>
          </div>

          {activeTask && (
            <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9.5px]">
              <span className="font-bold flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Active Pipeline Operation
              </span>
              <p className="text-gray-500 mt-1 font-sans">The AI is currently processing: {activeTask}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
