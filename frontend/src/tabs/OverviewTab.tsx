import { useState, useEffect } from "react";
import { Sparkles, Play, Bookmark, Clock, RefreshCw, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { askQuestion } from "../services/api";

interface StartingPoint {
  label: string;
  query: string;
}

const STARTING_POINTS: StartingPoint[] = [
  { label: "Authentication", query: "Explain how authentication is handled in this codebase." },
  { label: "API Layer", query: "Describe the REST API endpoint routing structure in this repository." },
  { label: "Database Models", query: "Show me the database models, tables, and connection structure." },
  { label: "Configuration", query: "List the configuration, environment settings, and setup files." },
  { label: "Routing & Entry", query: "Show the main entry points, app initialization, and URL routing paths." },
];

export interface Metrics {
  filesIndexed?: number;
  chunksIndexed?: number;
  [key: string]: any;
}

interface OverviewTabProps {
  repoPath: string;
  metrics: Metrics;
  onStartStartingPoint: (query: string) => void;
  onOpenFile: (path: string) => void;
}

export default function OverviewTab({
  repoPath,
  metrics,
  onStartStartingPoint,
  onOpenFile,
}: OverviewTabProps) {
  const [aiSummary, setAiSummary] = useState<string>(() => {
    return localStorage.getItem(`codepilot_summary_${repoPath}`) || "";
  });
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);

  // Auto-generate AI Repository Summary if missing
  useEffect(() => {
    if (!repoPath || aiSummary) return;
    setLoadingSummary(true);
    askQuestion(
      "Provide a concise technical summary of this repository. Write exactly four brief sections: 1. Core Purpose (what it does), 2. Main Technologies (frameworks used), 3. Main Entry Points (which files launch the app), and 4. High-level Architecture. Use clean Markdown styling.",
      repoPath
    )
      .then((res: any) => {
        if (res.answer) {
          setAiSummary(res.answer);
          localStorage.setItem(`codepilot_summary_${repoPath}`, res.answer);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch repository summary:", err);
      })
      .finally(() => setLoadingSummary(false));
  }, [repoPath, aiSummary]);

  // Load recent files and bookmarks from localStorage
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const open = JSON.parse(localStorage.getItem("codepilot_open_files") || "[]");
      setRecentFiles(open.slice(0, 4));
      
      const bmarks = JSON.parse(localStorage.getItem("codepilot_bookmarks") || "[]");
      setBookmarks(bmarks.slice(0, 4));
    } catch (e) {
      console.error("Failed to load local workspaces history:", e);
    }
  }, [repoPath]);

  const handleRefreshSummary = () => {
    setLoadingSummary(true);
    askQuestion(
      "Provide a concise technical summary of this repository. Write exactly four brief sections: 1. Core Purpose (what it does), 2. Main Technologies (frameworks used), 3. Main Entry Points (which files launch the app), and 4. High-level Architecture. Use clean Markdown styling.",
      repoPath
    )
      .then((res: any) => {
        if (res.answer) {
          setAiSummary(res.answer);
          localStorage.setItem(`codepilot_summary_${repoPath}`, res.answer);
        }
      })
      .catch((err) => {
        console.error("Failed to regenerate summary:", err);
      })
      .finally(() => setLoadingSummary(false));
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(repoPath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const repoName = repoPath ? repoPath.split(/[/\\]/).pop() : "Repository Overview";

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-4xl mx-auto py-6 px-4 pb-20 select-text">
      
      {/* Top Banner & Title Block */}
      <div className="flex items-start justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📂</span>
            <h1 className="text-2xl font-bold tracking-tight text-text-strong font-display">
              {repoName}
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-success glowing-dot ml-1.5" title="Indexed and Ready" />
          </div>
          
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-[11px] text-muted font-mono break-all">{repoPath}</p>
            <button
              onClick={handleCopyPath}
              className="p-1 rounded hover:bg-panel border border-transparent hover:border-border text-muted hover:text-text-strong transition-all"
              title="Copy path"
            >
              {copiedPath ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* AI Repository Summary Card (Glassmorphism & Radial glow effect) */}
      <div className="glass rounded-2xl p-6 space-y-4 shadow-xl border border-border/80 relative overflow-hidden">
        {/* Glow backdrop inside the card */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent/5 to-secondary/5 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-border pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-strong font-display">
              AI Codebase Intelligence Summary
            </h3>
          </div>
          
          <button
            onClick={handleRefreshSummary}
            disabled={loadingSummary}
            title="Regenerate Repository Summary"
            className="p-2 rounded-xl bg-panel border border-border hover:border-accent/40 text-soft hover:text-text-strong transition-all glass-hover"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSummary ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="relative z-10">
          {loadingSummary ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4">
              <span className="w-7 h-7 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></span>
              <p className="text-xs text-soft font-mono animate-pulse">Synthesizing codebase layout and structure...</p>
            </div>
          ) : aiSummary ? (
            <div className="text-sm text-text leading-relaxed font-body prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:font-display prose-headings:text-text-strong prose-headings:mt-4 prose-headings:mb-2">
              <ReactMarkdown>{aiSummary}</ReactMarkdown>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-muted font-mono italic">
              No summary generated. Click refresh button above to generate a structural review.
            </div>
          )}
        </div>
      </div>

      {/* Suggested Starting Points */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
          Explore Code flows
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {STARTING_POINTS.map((point) => (
            <button
              key={point.label}
              onClick={() => onStartStartingPoint(point.query)}
              className="px-4 py-3 rounded-xl border border-border bg-panel hover:border-accent/40 text-text hover:text-text-strong transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer glass-hover"
            >
              <Play className="w-3 h-3 text-accent fill-accent" />
              <span className="font-body">{point.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Working grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className="bg-panel border border-border rounded-2xl p-5 space-y-4 shadow-lg">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-strong flex items-center gap-2 border-b border-border pb-3 font-mono">
            <Clock className="w-3.5 h-3.5 text-muted" />
            <span>Recent Files</span>
          </h4>
          <div className="space-y-1.5">
            {recentFiles.length === 0 ? (
              <p className="text-xs text-muted italic py-2 font-body">No files opened recently.</p>
            ) : (
              recentFiles.map((f) => (
                <button
                  key={f}
                  onClick={() => onOpenFile(f)}
                  className="w-full text-left p-2 rounded-lg hover:bg-accent-dim/10 text-xs text-text hover:text-accent transition-all font-mono truncate block"
                >
                  📄 {f.split(/[/\\]/).pop()} <span className="text-[9px] text-muted ml-2">{f}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Bookmarked Modules */}
        <div className="bg-panel border border-border rounded-2xl p-5 space-y-4 shadow-lg">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-strong flex items-center gap-2 border-b border-border pb-3 font-mono">
            <Bookmark className="w-3.5 h-3.5 text-muted" />
            <span>Bookmarked Modules</span>
          </h4>
          <div className="space-y-1.5">
            {bookmarks.length === 0 ? (
              <div className="text-xs text-muted italic py-2 space-y-1 font-body">
                <p>No bookmarks pinned.</p>
                <p className="text-[10px] opacity-75">Click the bookmark pin in the editor header to pin modules here.</p>
              </div>
            ) : (
              bookmarks.map((f) => (
                <button
                  key={f}
                  onClick={() => onOpenFile(f)}
                  className="w-full text-left p-2 rounded-lg hover:bg-accent-dim/10 text-xs text-text hover:text-accent transition-all font-mono truncate block"
                >
                  ⭐ {f.split(/[/\\]/).pop()} <span className="text-[9px] text-muted ml-2">{f}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workspace Statistics - Glowing HUD elements */}
      <div className="border-t border-border pt-6 space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
          Workspace Telemetry
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-panel border border-border rounded-xl text-center shadow-md hover:border-secondary/20 transition-all duration-300">
            <span className="text-[10px] text-muted font-mono block">Files Indexed</span>
            <span className="block text-2xl font-extrabold text-text-strong font-mono mt-1">
              {metrics.filesIndexed || 0}
            </span>
          </div>
          
          <div className="p-4 bg-panel border border-border rounded-xl text-center shadow-md hover:border-secondary/20 transition-all duration-300">
            <span className="text-[10px] text-muted font-mono block">Symbols Indexed</span>
            <span className="block text-2xl font-extrabold text-text-strong font-mono mt-1">
              {metrics.chunksIndexed || 0}
            </span>
          </div>

          <div className="p-4 bg-panel border border-border rounded-xl text-center shadow-md flex flex-col items-center justify-center gap-1.5 hover:border-success/20 transition-all duration-300">
            <span className="text-[10px] text-muted font-mono block">Index Status</span>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-success-bg border border-success/25 text-[10px] font-bold text-success font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success glowing-dot" /> READY
            </span>
          </div>

          <div className="p-4 bg-panel border border-border rounded-xl text-center shadow-md hover:border-accent/20 transition-all duration-300">
            <span className="text-[10px] text-muted font-mono block">Platform Version</span>
            <span className="block text-2xl font-extrabold text-accent font-mono mt-1">
              v6.0
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
