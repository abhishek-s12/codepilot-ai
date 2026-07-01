import { IconSearch } from "../components/icons/Icons";

export default function SearchTab({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearchingSemantic,
  onSearch,
  onOpenFile,
}) {
  return (
    <div className="space-y-6 animate-fade-in w-full flex flex-col h-[550px]">
      <div className="border-b border-white/5 pb-4 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <IconSearch className="w-5 h-5 text-indigo-400" /> Semantic Code Search
        </h2>
        <p className="mt-1 text-xs text-soft leading-relaxed">
          Search repository codebase using natural language. Retrieves the closest matching code chunks using vector similarity embeddings.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={onSearch} className="flex gap-3 shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. Where is the JWT authentication handled?"
          className="flex-grow p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
        />
        <button
          type="submit"
          disabled={isSearchingSemantic || !searchQuery.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 shrink-0"
        >
          {isSearchingSemantic ? "Searching..." : "Search Code"}
        </button>
      </form>

      {/* Search results */}
      <div className="flex-grow overflow-y-auto space-y-4 pb-4">
        {searchResults.length === 0 ? (
          <div className="py-16 text-center text-gray-600 italic space-y-2">
            <IconSearch className="w-8 h-8 mx-auto opacity-40 text-gray-500" />
            <p className="text-xs">No search results generated yet. Enter a query above.</p>
          </div>
        ) : (
          searchResults.map((result, idx) => (
            <div key={idx} className="p-4.5 rounded-2xl border border-white/5 bg-black/20 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
                <div>
                  <span className="text-xs font-bold text-white font-mono">{result.file}</span>
                  <span className="text-[10px] text-indigo-300 font-mono ml-3 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {result.type || "file"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500 font-mono">Score: {result.score}</span>
                  <button
                    onClick={() => onOpenFile(result.path)}
                    className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
                  >
                    Quick Open
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[11px] text-gray-300 overflow-x-auto max-h-[160px]">
                {result.snippet}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
