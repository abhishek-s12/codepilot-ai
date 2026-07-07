import { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2, Wifi, WifiOff } from "lucide-react";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "../../services/collaboration";
import { useCollaborationSocket } from "../../hooks/useCollaborationSocket";

export default function CommentSystem({ activeFile }) {
  const fileLabel = activeFile ? activeFile.split(/[/\\]/).pop() : "Global";
  const [newText, setNewText] = useState("");

  const projectId = "default-project";
  // Initialize WebSocket connection hook for collaboration events
  const { store } = useCollaborationSocket(projectId);

  const [comments, setComments] = useState(() => store.getState().comments);
  const [isConnected, setIsConnected] = useState(() => store.getState().connected);

  useEffect(() => {
    // Subscribe to shared collaboration store updates
    const unsubscribe = store.subscribe((state) => {
      setComments(state.comments);
      setIsConnected(state.connected);
    });

    // Fetch initial comments from database
    fetchComments(projectId)
      .then((data) => {
        store.setComments(data || []);
      })
      .catch((err) => console.error("[CommentSystem] Fetch failed:", err));

    return unsubscribe;
  }, [store, projectId]);

  const handleAdd = () => {
    if (!newText.trim()) return;
    addComment(projectId, fileLabel, 0, newText)
      .then(() => {
        setNewText("");
      })
      .catch((err) => console.error("[CommentSystem] Post failed:", err));
  };

  const handleDelete = (id) => {
    deleteComment(id).catch((err) =>
      console.error("[CommentSystem] Delete failed:", err)
    );
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Codebase
            Comments
          </h3>
          <p className="text-[10px] text-gray-500 font-sans">
            Line annotations and team comments on active files.
          </p>
        </div>

        {/* WebSocket Connection Status Widget */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#141822] border border-[#1c2230]">
          {isConnected ? (
            <>
              <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span className="text-[7.5px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Live
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-2.5 h-2.5 text-rose-400" />
              <span className="text-[7.5px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                Offline
              </span>
            </>
          )}
        </div>
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
          onClick={handleAdd}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] font-mono transition-colors flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-2 max-h-[170px] overflow-y-auto scrollbar-thin pr-1">
        {comments.length === 0 ? (
          <div className="py-6 text-center text-[9.5px] font-mono text-gray-600 italic">
            No comments yet. Be the first to note!
          </div>
        ) : (
          comments.map((comm) => (
            <div
              key={comm.id}
              className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl relative group"
            >
              <button
                onClick={() => handleDelete(comm.id)}
                className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-500">
                <span className="font-bold text-indigo-400">{comm.author}</span>
                <span>on {comm.file || comm.target}</span>
              </div>
              <p className="text-[9.5px] text-gray-300 leading-normal mt-1 font-mono">
                {comm.comment_text || comm.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
