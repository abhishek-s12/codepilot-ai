import { IconFlow } from "../components/icons/Icons";
import FormatText from "../components/common/FormatText";

function parseSymbolLabel(symbolStr) {
  if (!symbolStr.includes("::")) return { file: "", name: symbolStr };
  const [file, name] = symbolStr.split("::");
  return { file, name };
}

export default function FlowTab({ flowData, isFlowLoading, onGetFlow, onInspectSymbol }) {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <IconFlow className="w-5 h-5 text-indigo-400" /> Code Execution Trace Flow
        </h2>
        <p className="mt-1 text-xs text-soft leading-relaxed">
          Visual sequential timeline tracing how requests pipeline across modules, supported by architectural step descriptions.
        </p>
      </div>

      {!flowData ? (
        <div className="py-16 text-center text-gray-500 space-y-4">
          <IconFlow className="w-10 h-10 mx-auto text-gray-600 opacity-60" />
          <p className="text-sm">Trace timeline not generated yet.</p>
          <button
            onClick={onGetFlow}
            disabled={isFlowLoading}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all inline-flex items-center gap-1.5"
          >
            {isFlowLoading ? "Tracing..." : "Generate Execution Flow"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 font-mono">Execution Flow Path</h3>
            <div className="relative border-l border-indigo-500/20 pl-6 ml-3 space-y-8 py-2">
              {flowData.flow.split("\n\n").map((segment, idx) => {
                const steps = segment.split("\n    ->\n");
                return (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-950 border border-indigo-400/50 group-hover:scale-110 transition-transform">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                    </span>

                    <div className="p-4 rounded-2xl border border-white/5 bg-black/20 group-hover:border-indigo-500/10 transition-all space-y-2">
                      {steps.map((step, sIdx) => {
                        const parsed = parseSymbolLabel(step);
                        return (
                          <div key={sIdx} className="flex flex-col">
                            {sIdx > 0 && (
                              <div className="pl-3 py-1 flex items-center text-indigo-400/40 text-[10px]">
                                <span className="font-mono">▼ calls</span>
                              </div>
                            )}
                            <button
                              onClick={() => onInspectSymbol(step)}
                              className="text-left font-mono text-xs text-indigo-300 hover:text-indigo-200 truncate font-semibold pl-2 hover:bg-white/5 rounded py-1 transition-all"
                            >
                              {parsed.name}
                              {parsed.file && <span className="text-[9px] text-gray-500 font-normal ml-2">({parsed.file})</span>}
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

          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 font-mono">Architectural Explanation</h3>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2.5">
              <FormatText text={flowData.explanation} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
