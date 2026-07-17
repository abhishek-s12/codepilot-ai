import { IconCpu, IconNetwork, IconFlow, IconArrowRight } from "../icons/Icons";

interface AnalyzerPanelProps {
  onGetArchitecture?: () => void;
  onGetCallGraph?: () => void;
  onGetFlow?: () => void;
  isArchitectureLoading?: boolean;
  isGraphLoading?: boolean;
  isFlowLoading?: boolean;
}

export default function AnalyzerPanel({
  onGetArchitecture,
  onGetCallGraph,
  onGetFlow,
  isArchitectureLoading,
  isGraphLoading,
  isFlowLoading,
}: AnalyzerPanelProps) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-gray-900/40 glass">
      <div className="flex items-center gap-2 mb-4">
         <IconCpu className="w-4 h-4 text-violet-theme" />
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">Codebase Analyzers</h3>
      </div>

      <div className="space-y-3">
        <button
          onClick={onGetArchitecture}
          disabled={isArchitectureLoading}
          aria-label="Retrieve codebase architecture graph"
          className="w-full px-4 py-3 rounded-xl border border-white/10 hover:border-accent/40 bg-white/5 hover:bg-accent-strong/5 text-left text-sm font-semibold text-white transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2.5">
            <IconCpu className="w-4 h-4 text-accent" /> Codebase Architecture
          </span>
          {isArchitectureLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></span>
          ) : (
            <IconArrowRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <button
          onClick={onGetCallGraph}
          disabled={isGraphLoading}
          aria-label="Retrieve code call graph"
          className="w-full px-4 py-3 rounded-xl border border-white/10 hover:border-violet-theme/40 bg-white/5 hover:bg-violet-dim/5 text-left text-sm font-semibold text-white transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2.5">
            <IconNetwork className="w-4 h-4 text-violet-theme" /> Code Call Graph
          </span>
          {isGraphLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-violet-theme/20 border-t-violet-theme rounded-full animate-spin"></span>
          ) : (
            <IconArrowRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <button
          onClick={onGetFlow}
          disabled={isFlowLoading}
          aria-label="Retrieve execution flow graph"
          className="w-full px-4 py-3 rounded-xl border border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-emerald-500/5 text-left text-sm font-semibold text-white transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2.5">
            <IconFlow className="w-4 h-4 text-emerald-400" /> Execution Flow
          </span>
          {isFlowLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></span>
          ) : (
            <IconArrowRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}
