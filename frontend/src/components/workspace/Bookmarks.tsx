import { useState } from "react";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";

interface BookmarkItem {
  id: number;
  name: string;
  path: string;
  details?: string;
}

interface BookmarksProps {
  onOpenFile?: (path: string) => void;
}

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  { id: 1, name: "main.py entry point", path: "backend/main.py", details: "FastAPI server initialization" },
  { id: 2, name: "analytics_service complexity logic", path: "backend/services/analytics_service.py", details: "Line 24: calculate_ast_complexity" },
];

function loadBookmarks(): BookmarkItem[] {
  const saved = localStorage.getItem("workspace-bookmarks");
  if (saved) {
    try {
      return JSON.parse(saved) as BookmarkItem[];
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  }
  return DEFAULT_BOOKMARKS;
}

export default function Bookmarks({ onOpenFile }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(loadBookmarks);

  const saveBookmarks = (updated: BookmarkItem[]) => {
    setBookmarks(updated);
    localStorage.setItem("workspace-bookmarks", JSON.stringify(updated));
  };

  const removeBookmark = (id: number) => {
    saveBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-accent" /> Codebase Bookmarks
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">Quick-link references to files, components, and key symbols.</p>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto scrollbar-thin pr-1">
        {bookmarks.length === 0 ? (
          <p className="text-center italic text-gray-600 text-[10px] py-4">No code bookmarks created yet.</p>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-3 bg-[#141822] border border-[#1c2230] hover:border-accent/20 rounded-xl flex justify-between items-center gap-3 transition-all"
            >
              <div className="space-y-0.5 truncate text-[10px] font-mono">
                <span className="font-bold text-white block truncate">{bookmark.name}</span>
                <span className="text-gray-500 text-[9px] block truncate">{bookmark.path}</span>
                {bookmark.details && <span className="text-accent/80 text-[8.5px] block truncate">{bookmark.details}</span>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                {onOpenFile && (
                  <button
                    onClick={() => onOpenFile(bookmark.path)}
                    aria-label={`Open file: ${bookmark.path}`}
                    title="Open File Location"
                    className="p-1 rounded hover:bg-accent-strong/10 text-gray-400 hover:text-accent cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  aria-label={`Remove bookmark: ${bookmark.name}`}
                  title="Remove Bookmark"
                  className="p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
