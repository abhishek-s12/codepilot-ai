import { IconTerminal, IconCode, IconCopy, IconCheck } from "../components/icons/Icons";
import FormatText from "../components/common/FormatText";

export default function ChatTab({ chatHistory, isAsking, copiedIndex, onCopy, onOpenFile, chatBottomRef }) {
  return (
    <div className="space-y-6 animate-fade-in flex flex-col w-full h-[550px]">
      <div className="border-b border-white/5 pb-4 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <IconTerminal className="w-5 h-5 text-indigo-400" /> Streaming Assistant Conversation
        </h2>
        <p className="mt-1 text-xs text-soft leading-relaxed">
          Chats are securely grounded in repository contexts. The system retrieves codebase references to draft responses.
        </p>
      </div>

      {/* Message Log */}
      <div className="flex-grow space-y-4 overflow-y-auto pr-2 pb-4">
        {chatHistory.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-3">
            <IconTerminal className="w-10 h-10 mx-auto text-gray-600 opacity-60" />
            <p className="text-sm">No queries started yet. Type a question in the prompt sidebar or select a suggestion.</p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4.5 rounded-2xl border transition-all ${
                msg.role === "user"
                  ? "bg-white/2.5 border-white/5 self-end"
                  : "bg-indigo-500/5 border-indigo-500/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    msg.role === "user"
                      ? "bg-white/5 text-gray-300"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                  }`}>
                    {msg.role === "user" ? "Developer" : "CodePilot Assistant"}
                  </span>
                </div>
                <button
                  onClick={() => onCopy(msg.content, idx)}
                  className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
                >
                  {copiedIndex === idx ? (
                    <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <IconCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="text-sm font-normal text-gray-200 break-words overflow-hidden">
                {msg.content === "" && msg.role === "assistant" ? (
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs">
                    <span className="w-2.5 h-2.5 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin"></span>
                    <span>Writing answer...</span>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <FormatText text={msg.content} />
                    </div>
                    {isAsking && idx === chatHistory.length - 1 && (
                      <span className="inline-block w-1.5 h-3 bg-indigo-400 animate-pulse ml-0.5"></span>
                    )}
                  </>
                )}
              </div>

              {/* Attributed Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">Codebase Context Checked:</span>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => onOpenFile(src.path)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 border border-white/5 text-xs text-indigo-300 hover:border-indigo-500/30 transition-all font-mono"
                      >
                        <IconCode className="w-3 h-3 text-indigo-400" />
                        {src.symbol || src.file}
                        <span className="text-[9px] text-gray-500 ml-1">({src.score})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
}
