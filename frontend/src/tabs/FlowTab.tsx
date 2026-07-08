import { IconFlow } from "../components/icons/Icons";
import FormatText from "../components/common/FormatText";

interface SymbolLabel {
  file: string;
  name: string;
}

function parseSymbolLabel(symbolStr: string): SymbolLabel {
  if (!symbolStr.includes("::")) return { file: "", name: symbolStr };
  const [file, name] = symbolStr.split("::");
  return { file, name };
}

export interface FlowData {
  flow: string;
  explanation: string;
}

interface FlowTabProps {
  flowData: FlowData | null | undefined;
  isFlowLoading: boolean;
  onGetFlow: () => void;
  onInspectSymbol: (symbol: string) => void;
}

export default function FlowTab({
  flowData,
  isFlowLoading,
  onGetFlow,
  onInspectSymbol,
}: FlowTabProps) {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header bar */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-text-strong flex items-center gap-2 font-display">
          <IconFlow className="w-5 h-5 text-accent" /> Code Execution Trace Flow
        </h2>
        <p className="mt-1 text-xs text-soft leading-relaxed font-body">
          Visual sequential timeline tracing how requests pipeline across modules, supported by architectural step descriptions.
        </p>
      </div>

      {!flowData ? (
        <div className="py-24 text-center text-muted space-y-4">
          <IconFlow className="w-12 h-12 mx-auto text-muted opacity-40 animate-pulse" />
          <p className="text-sm font-body">Trace timeline not generated yet.</p>
          <button
            onClick={onGetFlow}
            disabled={isFlowLoading}
            className="px-5 py-3 text-xs font-semibold bg-accent text-bg hover:bg-accent-strong rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer font-mono shadow-md"
          >
            {isFlowLoading ? "Tracing Codeflow..." : "Generate Execution Flow"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          
          {/* Timeline View */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-muted tracking-wider mb-2 font-mono">
              Execution Flow Path
            </h3>
            <div className="relative border-l-2 border-accent/20 pl-6 ml-3 space-y-8 py-2">
              {flowData.flow.split("\n\n").map((segment, idx) => {
                const steps = segment.split("\n    ->\n");
                return (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[32px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg border border-accent/50 group-hover:scale-110 transition-transform">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent glowing-dot"></span>
                    </span>

                    <div className="p-4.5 rounded-2xl border border-border bg-panel-alt hover:border-accent/30 transition-all space-y-2.5 shadow-md glass-hover">
                      {steps.map((step, sIdx) => {
                        const parsed = parseSymbolLabel(step);
                        return (
                          <div key={sIdx} className="flex flex-col">
                            {sIdx > 0 && (
                              <div className="pl-3 py-1 flex items-center text-accent/50 text-[10px]">
                                <span className="font-mono">▼ calls</span>
                              </div>
                            )}
                            <button
                              onClick={() => onInspectSymbol(step)}
                              className="text-left font-mono text-xs text-secondary hover:text-secondary-strong truncate font-semibold pl-2 hover:bg-panel-alt-2 rounded py-1 transition-all"
                            >
                              {parsed.name}
                              {parsed.file && (
                                <span className="text-[9px] text-muted font-normal ml-2">({parsed.file})</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-muted tracking-wider mb-2 font-mono">
              Architectural Explanation
            </h3>
            <div className="p-6 rounded-2xl border border-border bg-panel shadow-md prose prose-invert prose-sm">
              <FormatText text={flowData.explanation} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
