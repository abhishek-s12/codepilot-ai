import { useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

export default function CommentSystem({ activeFile }) {
  const fileLabel = activeFile ? activeFile.split(/[/\\]/).pop() : "Global";

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem("workspace-comments");
    return saved ? JSON.parse(saved) : [
      { id: 1, author: "Alek", text: "SQLite connectors should execute async.", target: "main.py" },
      { id: 2, author: "Me", text: "PEP-8 guidelines verified clean.", target: "auth.py" }
    ];
  });
  const [newText, setNewText] = useState("");

  const saveComments = (updated) => {
    setComments(updated);
    localStorage.setItem("workspace-comments", JSON.stringify(updated));
  };

  const addComment = () => {
    if (!newText.trim()) return;
    const newComm = {
      id: Date.now(),
      author: "Me",
      text: newText,
      target: fileLabel,
    };
    saveComments([newComm, ...comments]);
    setNewText("");
  };

  const deleteComment = (id) => {
    saveComments(comments.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-indigo-400" /> Codebase Comments & Annotations
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">Line annotations and team comments on active files.</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={`Comment on ${fileLabel}...`}
          className="w-full bg-[#0c0f16] border border-[#1c2230] rounded-xl px-2.5 py-1 text-[10px] font-mono text-white placeholder-gray-600 focus:outline-none"
        />
        <button
          onClick={addComment}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] font-mono transition-colors flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-2 max-h-[170px] overflow-y-auto scrollbar-thin pr-1">
        {comments.map((comm) => (
          <div key={comm.id} className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl relative group">
            <button
              onClick={() => deleteComment(comm.id)}
              className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-500">
              <span className="font-bold text-indigo-400">{comm.author}</span>
              <span>on {comm.target}</span>
            </div>
            <p className="text-[9.5px] text-gray-300 leading-normal mt-1 font-mono">{comm.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
