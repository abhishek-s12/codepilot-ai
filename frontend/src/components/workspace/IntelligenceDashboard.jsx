import { useState } from "react";
import { ShieldCheck, Bug, Lightbulb, Shield, BookOpen, Cpu } from "lucide-react";
import CodeReviewPanel from "./CodeReviewPanel";
import BugAnalysis from "./BugAnalysis";
import RefactorAssistant from "./RefactorAssistant";
import TestGenerator from "./TestGenerator";
import DocumentationGenerator from "./DocumentationGenerator";

export default function IntelligenceDashboard({ activeFile, onSendMessage, onClose }) {
  const [intelTab, setIntelTab] = useState("review"); // review | bugs | refactor | tests | docs

  const tabs = [
    { id: "review", label: "Review", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: "bugs", label: "Bugs", icon: <Bug className="w-3.5 h-3.5" /> },
    { id: "refactor", label: "Refactor", icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: "tests", label: "Tests", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "docs", label: "Docs", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  const handleTriggerAction = (prompt) => {
    if (onSendMessage) {
      onSendMessage({
        repo: "",
        file: activeFile || "",
        symbol: "",
        selection: "",
        message: prompt,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1219] text-gray-200 border-l border-[#1c2230] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c2230] px-4 py-2.5 bg-[#0c0f16] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">AI Code Intelligence</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1c2230]/40 bg-[#0c0f16]/40 shrink-0 select-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setIntelTab(tab.id)}
            className={`flex-1 py-2 px-1 text-[9px] font-mono font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
              intelTab === tab.id
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/3"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin min-h-0">
        {intelTab === "review" && (
          <CodeReviewPanel activeFile={activeFile} onTriggerAction={handleTriggerAction} />
        )}
        {intelTab === "bugs" && (
          <BugAnalysis activeFile={activeFile} onTriggerAction={handleTriggerAction} />
        )}
        {intelTab === "refactor" && (
          <RefactorAssistant activeFile={activeFile} onTriggerAction={handleTriggerAction} />
        )}
        {intelTab === "tests" && (
          <TestGenerator activeFile={activeFile} onTriggerAction={handleTriggerAction} />
        )}
        {intelTab === "docs" && (
          <DocumentationGenerator activeFile={activeFile} onTriggerAction={handleTriggerAction} />
        )}
      </div>

    </div>
  );
}
