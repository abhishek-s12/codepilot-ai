import { useState } from "react";
import { Download, FileCode, CheckCircle, RefreshCw } from "lucide-react";

export default function ReportGenerator() {
  const [generating, setGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    setReportReady(false);
    setTimeout(() => {
      setGenerating(false);
      setReportReady(true);
    }, 2000);
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <FileCode className="w-4 h-4 text-indigo-400" /> AI Workspace Report Builder
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">Compile detailed PDF/Markdown audit sheets.</p>
      </div>

      <div className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl space-y-3">
        <button
          onClick={generateReport}
          disabled={generating}
          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-bold rounded-lg text-[10px] font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          {generating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling Report...
            </>
          ) : (
            "Generate Audit Report"
          )}
        </button>

        {reportReady && (
          <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 text-[9.5px] flex items-center justify-between gap-3">
            <span className="font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Workspace Audit Ready
            </span>
            <button className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold flex items-center gap-1 hover:bg-emerald-500 transition-colors cursor-pointer">
              <Download className="w-3 h-3" /> Get PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
