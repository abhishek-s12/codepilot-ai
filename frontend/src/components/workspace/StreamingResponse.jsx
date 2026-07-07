import { useState, useEffect } from "react";
import { Loader2, FileText } from "lucide-react";

export function ThinkingIndicator({ currentStep = 0 }) {
  const steps = [
    "Reading repository structure...",
    "Scanning code abstract syntax tree...",
    "Understanding import dependency chains...",
    "Assembling context reference bindings...",
    "Formulating response explanation...",
  ];

  return (
    <div className="bg-[#141822] border border-[#1c2230] rounded-xl p-4.5 space-y-3 shadow-lg select-none text-left">
      <div className="flex items-center gap-2 border-b border-[#1c2230]/40 pb-2">
        <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
        <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
          AI Indexing Context...
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((stepText, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-[9.5px] font-mono">
              {isCompleted ? (
                <span className="text-emerald-400 font-bold">✓</span>
              ) : isCurrent ? (
                <Loader2 className="w-3 h-3 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <span className="text-gray-700 font-bold">•</span>
              )}
              <span
                className={
                  isCompleted
                    ? "text-gray-500 line-through"
                    : isCurrent
                    ? "text-white font-bold"
                    : "text-gray-600"
                }
              >
                {stepText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LiveContextPanel({ activeFile = "", references = [] }) {
  return (
    <div className="p-3 bg-[#0f1219]/60 border border-[#1c2230]/70 rounded-xl space-y-2 text-left select-none font-mono text-[9px]">
      <span className="text-gray-500 uppercase font-bold tracking-wider block mb-1">Knowledge Sources</span>
      {activeFile && (
        <div className="flex items-center gap-1.5 text-white bg-[#141822] border border-[#1c2230] p-1.5 rounded-lg truncate">
          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">Active: {activeFile.split(/[/\\]/).pop()}</span>
        </div>
      )}
      {references.length > 0 && (
        <div className="space-y-1 pt-1.5 border-t border-[#1c2230]/40">
          <span className="text-gray-600 font-bold uppercase block">Referenced Modules:</span>
          {references.map((ref, idx) => (
            <div key={idx} className="flex items-center gap-1 text-gray-400 truncate pl-1">
              <span>•</span>
              <span className="truncate">{ref.split(/[/\\]/).pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TokenUsageCard({ promptTokens = 425, completionTokens = 188, latencyMs = 840 }) {
  const estimatedCost = ((promptTokens * 0.0015 + completionTokens * 0.002) / 1000).toFixed(6);

  return (
    <div className="p-3 bg-[#0f1219] border border-[#1c2230] rounded-xl space-y-2 text-left font-mono text-[9px] select-none text-gray-500">
      <div className="flex justify-between items-center border-b border-[#1c2230]/40 pb-1.5">
        <span className="text-gray-400 uppercase font-bold tracking-wider">AI Telemetry stats</span>
        <span className="text-emerald-400 font-bold">{latencyMs}ms</span>
      </div>
      <div className="flex justify-between">
        <span>Prompt Tokens:</span>
        <span className="text-white font-bold">{promptTokens}</span>
      </div>
      <div className="flex justify-between">
        <span>Completion Tokens:</span>
        <span className="text-white font-bold">{completionTokens}</span>
      </div>
      <div className="flex justify-between border-t border-[#1c2230]/20 pt-1.5 mt-1.5">
        <span>Estimated Cost:</span>
        <span className="text-indigo-400 font-bold">${estimatedCost}</span>
      </div>
    </div>
  );
}

export default function StreamingResponse({
  text = "",
  isStreaming = false,
  activeFile = "",
  references = [],
}) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="space-y-4 p-1">
      {isStreaming && currentStep < 4 && (
        <ThinkingIndicator currentStep={currentStep} />
      )}

      {text && (
        <div className="bg-[#0f1219]/40 border border-[#1c2230] rounded-2xl p-4.5 shadow text-left font-sans text-xs leading-relaxed text-gray-200">
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeFile && (
          <LiveContextPanel activeFile={activeFile} references={references} />
        )}
        <TokenUsageCard
          promptTokens={240 + text.length}
          completionTokens={Math.max(10, Math.floor(text.length * 0.2))}
        />
      </div>
    </div>
  );
}
