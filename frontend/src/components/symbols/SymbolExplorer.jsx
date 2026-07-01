import { useEffect, useState } from "react";
import { fetchFileSymbols } from "../../services/api";
import SymbolList from "./SymbolList";
import { IconSearch } from "../icons/Icons";

export default function SymbolExplorer({ filePath, loading, onSelectSymbol }) {
  const [symbols, setSymbols] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filePath) return;

    const loadSymbols = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        const data = await fetchFileSymbols(filePath);
        setSymbols(data || []);
      } catch (err) {
        console.error("Error loading symbols:", err);
        setError("Outline unavailable");
      } finally {
        setFetchLoading(false);
      }
    };

    loadSymbols();
  }, [filePath]);

  const filteredSymbols = symbols.filter((sym) =>
    sym.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isOutlineLoading = loading || fetchLoading;

  return (
    <div className="flex flex-col h-full bg-slate-900/35 border border-white/5 rounded-2xl p-4 min-h-[380px] shrink-0 overflow-hidden select-none">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
          File Outline
        </h4>
        {isOutlineLoading && (
          <span className="w-3.5 h-3.5 border border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin"></span>
        )}
      </div>

      {/* Search Box */}
      <div className="relative mb-3">
        <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
        <input
          type="text"
          placeholder="Filter symbols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/35 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:outline-none rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-gray-500 font-mono transition-all"
        />
      </div>

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin">
        {error ? (
          <p className="text-xs text-gray-500 italic py-2">{error}</p>
        ) : filteredSymbols.length === 0 && !isOutlineLoading ? (
          <p className="text-xs text-gray-500 italic py-2">No matching symbols</p>
        ) : (
          <SymbolList symbols={filteredSymbols} onSelectSymbol={onSelectSymbol} />
        )}
      </div>
    </div>
  );
}
