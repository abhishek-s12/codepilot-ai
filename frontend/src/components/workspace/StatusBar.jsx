import { useState, useEffect, useRef } from "react";
import { WifiOff, FileCode } from "lucide-react";
import GitStatusWidget from "./GitStatusWidget";
import AIStatusWidget from "./AIStatusWidget";
import RepositoryStatusWidget from "./RepositoryStatusWidget";
import PerformanceWidget from "./PerformanceWidget";

export default function StatusBar({
  gitStatus = {},
  filesCount = 0,
  symbolsCount = 0,
  activeModel = "Gemini 1.5 Pro",
  isTaskActive = false,
  isOffline = false,
  encoding = "UTF-8",
  language = "JavaScript",
  cursorLine = 1,
  cursorCol = 1,
}) {
  const [openWidget, setOpenWidget] = useState(null); // null | 'git' | 'ai' | 'repo' | 'perf'
  const containerRef = useRef(null);

  const toggleWidget = (widgetId) => {
    setOpenWidget((prev) => (prev === widgetId ? null : widgetId));
  };

  // Click outside listener to close open status overlays
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenWidget(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[24px] bg-[#0c0f16] border-t border-[#1c2230] text-[10px] text-gray-500 font-mono px-3 shrink-0 select-none flex items-center justify-between z-30"
    >
      {/* Left side options */}
      <div className="flex items-center gap-4">
        {/* Git Widget */}
        <GitStatusWidget
          gitStatus={gitStatus}
          isOpen={openWidget === "git"}
          onToggle={() => toggleWidget("git")}
        />

        {/* Repository Index Widget */}
        <RepositoryStatusWidget
          filesCount={filesCount}
          symbolsCount={symbolsCount}
          dependencyNodes={filesCount * 2}
          isOpen={openWidget === "repo"}
          onToggle={() => toggleWidget("repo")}
        />

        {/* Connection state */}
        <div className="flex items-center gap-1.5 text-emerald-500 font-bold select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>

      {/* Middle connection warnings */}
      {isOffline && (
        <div className="flex items-center gap-1 text-rose-500 font-bold animate-pulse select-none">
          <WifiOff className="w-3 h-3" />
          <span>OFFLINE</span>
        </div>
      )}

      {/* Right side telemetry widgets */}
      <div className="flex items-center gap-4.5 select-none">
        {isTaskActive && (
          <div className="flex items-center gap-1 text-indigo-400 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping mr-1" />
            <span>AI indexing...</span>
          </div>
        )}

        {/* Encoding */}
        <span>{encoding}</span>

        {/* Current File / Language badge */}
        <div className="flex items-center gap-1 text-gray-400 font-semibold">
          <FileCode className="w-3 h-3 text-gray-500" />
          <span>{language}</span>
        </div>

        {/* Cursor Position */}
        <span>Ln {cursorLine}, Col {cursorCol}</span>

        {/* AI Model Status Widget */}
        <AIStatusWidget
          activeModel={activeModel}
          activeTask={isTaskActive ? "Scanning symbols context" : null}
          isOpen={openWidget === "ai"}
          onToggle={() => toggleWidget("ai")}
        />

        {/* Performance live status widget */}
        <PerformanceWidget
          isOpen={openWidget === "perf"}
          onToggle={() => toggleWidget("perf")}
        />
      </div>
    </div>
  );
}
