import { ShieldCheck, Sparkles } from "lucide-react";

export default function CodeReviewPanel({ activeFile, onTriggerAction }) {
  const fileLabel = activeFile ? activeFile.split(/[/\\]/).pop() : "Repository";

  const auditItems = [
    { cat: "Security", score: 94, state: "passing", details: "No active SQL injection or hardcoded secrets found in AST scope." },
    { cat: "Maintainability", score: 82, state: "warn", details: "Calculate complexity indicates some long loops in file helper blocks." },
    { cat: "Readability & Docs", score: 75, state: "warn", details: "Inline documentation comments missing on 3 core export functions." },
    { cat: "Scalability", score: 90, state: "passing", details: "Optimal resource memory bounds configured correctly." },
  ];

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Automated AI Code Review
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">Static analysis reviews for: {fileLabel}</p>
      </div>

      {/* Review items */}
      <div className="space-y-2.5">
        {auditItems.map((item, idx) => (
          <div key={idx} className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-gray-300">{item.cat} Audit</span>
              <span className={item.state === "passing" ? "text-emerald-400" : "text-amber-400"}>
                Score: {item.score}%
              </span>
            </div>
            <p className="text-[9.5px] text-gray-400 leading-normal font-mono">{item.details}</p>
          </div>
        ))}
      </div>

      {activeFile && onTriggerAction && (
        <button
          onClick={() => onTriggerAction(`Perform deep AI security and style guidelines review of the file ${activeFile}`)}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[10px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/15"
        >
          <Sparkles className="w-3.5 h-3.5" /> Trigger Deep AI Audit Scan
        </button>
      )}
    </div>
  );
}
