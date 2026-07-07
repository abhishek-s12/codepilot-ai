import { useState } from "react";
import { Play, Shield } from "lucide-react";

export default function TestGenerator({ activeFile, onTriggerAction }) {
  const [testFramework, setTestFramework] = useState("pytest"); // pytest | jest | mocha

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-indigo-400" /> AI Unit Test Generator
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">Generate automation tests suites with high coverage.</p>
      </div>

      {/* Selector */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider font-mono">Test Framework Target</span>
        <div className="flex bg-[#0c0f16] border border-[#1c2230] p-1 rounded-xl">
          {[
            { id: "pytest", label: "PyTest (Python)" },
            { id: "jest", label: "Jest (React)" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTestFramework(btn.id)}
              className={`flex-1 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                testFramework === btn.id ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl space-y-1 text-[9.5px] font-mono text-gray-500">
        <span className="font-bold text-white block">Auto-Generated Mock Targets:</span>
        <p>• Mock dependencies parameters injection</p>
        <p>• Exception bounds boundary assertions</p>
        <p>• Edge case arrays configurations</p>
      </div>

      {activeFile && onTriggerAction && (
        <button
          onClick={() => onTriggerAction(`Generate unit tests suite in ${testFramework} for the functions defined in the file ${activeFile}`)}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[10px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/15"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" /> Generate Test Suite
        </button>
      )}
    </div>
  );
}
