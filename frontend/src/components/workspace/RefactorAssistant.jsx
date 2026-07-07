import { ArrowRight, Lightbulb } from "lucide-react";

export default function RefactorAssistant({ activeFile, onTriggerAction }) {
  const recommendations = activeFile
    ? [
        { title: "Extract validation checks", target: "auth_token", type: "function", benefit: "Improves readability & DRY" },
        { title: "Simplify nested loops", target: "ast_visitor", type: "complexity", benefit: "Reduces runtime cognitive complexity" }
      ]
    : [];

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-indigo-400" /> AI Refactoring Assistant
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">AI recommendations to simplify logic structures.</p>
      </div>

      <div className="space-y-2.5">
        {recommendations.length === 0 ? (
          <p className="text-center italic text-gray-600 text-[10px] py-4">No active refactoring recommendations.</p>
        ) : (
          recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl relative group space-y-1">
              <h4 className="text-[10px] font-bold text-white font-mono flex items-center justify-between">
                <span>{rec.title}</span>
                <span className="text-[8.5px] uppercase bg-[#1c2230] px-1 rounded text-indigo-400 border border-[#2d3748] font-bold font-mono">
                  {rec.type}
                </span>
              </h4>
              <p className="text-[9.5px] text-gray-500 font-sans">Benefit: {rec.benefit}</p>
              {onTriggerAction && (
                <button
                  onClick={() => onTriggerAction(`Refactor the logic for: ${rec.title} inside ${activeFile}`)}
                  className="mt-1.5 py-1 px-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/25 text-indigo-400 font-bold rounded-lg text-[9px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                >
                  Apply suggestion <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
