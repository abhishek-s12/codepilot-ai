export default function SymbolList({ symbols, onSelectSymbol }) {
  const getKindBadge = (kind) => {
    const k = kind.toLowerCase();
    if (k === "class") {
      return (
        <span className="w-5 h-5 flex items-center justify-center text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
          C
        </span>
      );
    }
    if (k === "function" || k === "asyncfunctiondef" || k === "functiondef") {
      return (
        <span className="w-5 h-5 flex items-center justify-center text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          F
        </span>
      );
    }
    return (
      <span className="w-5 h-5 flex items-center justify-center text-[9px] font-bold rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
        M
      </span>
    );
  };

  return (
    <div className="space-y-1">
      {symbols.map((sym, index) => (
        <button
          key={index}
          onClick={() => onSelectSymbol(sym)}
          className="w-full text-left flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-white/5 transition-all text-xs font-mono text-gray-300 hover:text-white"
        >
          <div className="flex items-center gap-2 min-w-0">
            {getKindBadge(sym.kind)}
            <span className="truncate">{sym.name}</span>
          </div>
          <span className="text-[10px] text-gray-500 select-none shrink-0 font-sans">
            ln {sym.line}
          </span>
        </button>
      ))}
    </div>
  );
}
