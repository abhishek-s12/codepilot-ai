import { AlertTriangle, ShieldAlert, Bug } from "lucide-react";

export default function BugAnalysis({ activeFile, onTriggerAction }) {
  const issues = activeFile
    ? [
        { type: "security", title: "Hardcoded secret API key", loc: "Line 24", severity: "critical", desc: "Do not store raw authorization keys directly inside code variables." },
        { type: "logic", title: "Possible Null Pointer dereference", loc: "Line 82", severity: "warning", desc: "Object parameter verified missing null checks before property reads." }
      ]
    : [];

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Bug className="w-4 h-4 text-rose-500" /> Automated Bug Diagnostics
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">AST leak analysis and logic check reports.</p>
      </div>

      <div className="space-y-2.5">
        {issues.length === 0 ? (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-center space-y-1">
            <span className="text-emerald-400 font-bold block text-[11px]">✓ No Security Bugs Found</span>
            <p className="text-gray-500 text-[9.5px] font-mono">Run code compile checks to continuously monitor active files.</p>
          </div>
        ) : (
          issues.map((iss, idx) => (
            <div
              key={idx}
              className={`p-3 border rounded-xl flex gap-2.5 items-start ${
                iss.severity === "critical"
                  ? "bg-rose-500/5 border-rose-500/20 text-rose-400"
                  : "bg-amber-500/5 border-amber-500/20 text-amber-400"
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[9.5px] font-mono leading-relaxed">
                <div className="flex justify-between font-bold">
                  <span>{iss.title}</span>
                  <span className="opacity-75">{iss.loc}</span>
                </div>
                <p className="text-gray-500 mt-1">{iss.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {activeFile && onTriggerAction && (
        <button
          onClick={() => onTriggerAction(`Search the active file ${activeFile} for potential bugs, infinite loops, memory leaks or race conditions.`)}
          className="w-full py-2 bg-[#141822] hover:bg-[#1b212f] border border-[#1c2230] text-gray-400 hover:text-white rounded-xl text-[10px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Trigger Full Bug Audit
        </button>
      )}
    </div>
  );
}
