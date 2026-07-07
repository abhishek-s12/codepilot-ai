import { useState } from "react";
import { Download, Check } from "lucide-react";

export default function ExportManager() {
  const [exportFormat, setExportFormat] = useState("markdown");
  const [copied, setCopied] = useState(false);

  const triggerExport = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Export Targets & Formats</h3>
        <p className="text-[10px] text-gray-500 font-sans">Save code segments or summaries files locally.</p>
      </div>

      <div className="space-y-3">
        <div className="flex bg-[#0c0f16] border border-[#1c2230] p-1 rounded-xl">
          {[
            { id: "pdf", label: "PDF Document" },
            { id: "markdown", label: "Markdown (.md)" },
            { id: "json", label: "JSON Data" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setExportFormat(btn.id)}
              className={`flex-1 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                exportFormat === btn.id ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <button
          onClick={triggerExport}
          className="w-full py-1.5 bg-[#141822] hover:bg-[#1b212f] border border-[#1c2230] text-gray-400 hover:text-white rounded-lg text-[10px] font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Export Completed
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Save Code/Summary
            </>
          )}
        </button>
      </div>
    </div>
  );
}
