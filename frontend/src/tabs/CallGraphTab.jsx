import { IconNetwork, IconSearch } from "../components/icons/Icons";

function parseSymbolLabel(symbolStr) {
  if (!symbolStr.includes("::")) return { file: "", name: symbolStr };
  const [file, name] = symbolStr.split("::");
  return { file, name };
}

export default function CallGraphTab({
  callGraph,
  graphSearch,
  setGraphSearch,
  selectedFunc,
  setSelectedFunc,
  filteredFunctions,
  functionCallers,
  isGraphLoading,
  onGetCallGraph,
}) {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <IconNetwork className="w-5 h-5 text-indigo-400" /> Interactive Dependency Call Graph
        </h2>
        <p className="mt-1 text-xs text-soft leading-relaxed">
          Trace functional hierarchies. Select defined classes and methods to view callers and outbound dependency calls.
        </p>
      </div>

      {!callGraph ? (
        <div className="py-16 text-center text-gray-500 space-y-4">
          <IconNetwork className="w-10 h-10 mx-auto text-gray-600 opacity-60" />
          <p className="text-sm">Call graph mappings not calculated yet.</p>
          <button
            onClick={onGetCallGraph}
            disabled={isGraphLoading}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all inline-flex items-center gap-1.5"
          >
            {isGraphLoading ? "Mapping..." : "Map Code Call Mappings"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">

          <div className="space-y-3.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={graphSearch}
                onChange={(e) => setGraphSearch(e.target.value)}
                placeholder="Search functions..."
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div className="max-h-[380px] overflow-y-auto border border-white/5 rounded-xl bg-black/20 divide-y divide-white/5">
              {filteredFunctions.length === 0 ? (
                <p className="p-4 text-xs text-gray-500 text-center font-mono">No matching symbols</p>
              ) : (
                filteredFunctions.map((func) => {
                  const parsed = parseSymbolLabel(func);
                  const isSelected = selectedFunc === func;
                  return (
                    <button
                      key={func}
                      onClick={() => setSelectedFunc(func)}
                      className={`w-full p-3 text-left transition-all text-xs font-mono block ${
                        isSelected
                          ? "bg-indigo-600 text-white font-medium"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/2.5"
                      }`}
                    >
                      <div className="truncate font-semibold">{parsed.name}</div>
                      {parsed.file && <div className={`truncate text-[9px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>{parsed.file}</div>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {selectedFunc ? (
            <div className="space-y-6">
              <div className="p-4.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider font-mono">Selected Symbol</span>
                <h3 className="text-base font-bold text-white font-mono truncate mt-1">
                  {parseSymbolLabel(selectedFunc).name}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono truncate mt-0.5">
                  Defined in: {parseSymbolLabel(selectedFunc).file || "Repository root"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-white/5 bg-black/25 min-h-[180px] flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block mb-3 font-mono flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping"></span>
                    Callers (Incoming)
                  </span>
                  <div className="flex-grow space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {functionCallers.length === 0 ? (
                      <p className="text-xs text-gray-600 italic font-mono pt-4 text-center">No incoming calls detected.</p>
                    ) : (
                      functionCallers.map((caller) => (
                        <button
                          key={caller}
                          onClick={() => setSelectedFunc(caller)}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/5 text-left text-xs font-mono text-gray-300 hover:text-white hover:border-indigo-500/20 hover:bg-white/10 transition-all block truncate"
                        >
                          {parseSymbolLabel(caller).name}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-black/25 min-h-[180px] flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-3 font-mono flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Callees (Outgoing)
                  </span>
                  <div className="flex-grow space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {!callGraph[selectedFunc] || callGraph[selectedFunc].length === 0 ? (
                      <p className="text-xs text-gray-600 italic font-mono pt-4 text-center">Calls no internal functions.</p>
                    ) : (
                      callGraph[selectedFunc].map((callee) => (
                        <button
                          key={callee}
                          onClick={() => setSelectedFunc(callee)}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/5 text-left text-xs font-mono text-gray-300 hover:text-white hover:border-indigo-500/20 hover:bg-white/10 transition-all block truncate"
                        >
                          {parseSymbolLabel(callee).name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs font-mono">Select a function symbol from the sidebar to inspect dependencies.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
