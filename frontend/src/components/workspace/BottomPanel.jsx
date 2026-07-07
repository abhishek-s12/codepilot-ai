import { useState, useEffect, useRef } from "react";
import { AlertCircle, AlertTriangle, Cpu, Database, Maximize2, Minimize2, Copy, Check } from "lucide-react";
import GitPanel from "../git/GitPanel";

export default function BottomPanel({
  repoPath,
  filesList = [],
  activeTab = "terminal",
  onClose = () => {},
}) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isMaximized, setIsMaximized] = useState(false);

  // Terminal states
  const [terminalHistory, setTerminalHistory] = useState([
    { text: "Microsoft Windows [Version 10.0.22631]", type: "sys" },
    { text: "(c) Microsoft Corporation. All rights reserved.", type: "sys" },
    { text: "", type: "sys" },
    { text: "d:\\codepilot-ai> npm run dev", type: "cmd" },
    { text: "codepilot-ai@1.0.0 dev", type: "sys" },
    { text: "vite --host 0.0.0.0 --port 5173", type: "sys" },
    { text: "  VITE v8.0.16  ready in 234 ms", type: "success" },
    { text: "  ➜  Local:   http://localhost:5173/", type: "success" },
    { text: "  ➜  Network: use --host to expose", type: "success" },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef(null);
  const [copiedTerminal, setCopiedTerminal] = useState(false);

  // Terminal commands handling
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const newLines = [...terminalHistory, { text: `d:\\codepilot-ai> ${cmd}`, type: "cmd" }];

    if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "git status") {
      newLines.push({ text: "On branch main", type: "sys" });
      newLines.push({ text: "Your branch is up to date with 'origin/main'.", type: "sys" });
      newLines.push({ text: "Changes not staged for commit:", type: "sys" });
      newLines.push({ text: "  (use \"git add <file>...\" to update what will be committed)", type: "sys" });
      newLines.push({ text: "       modified:   frontend/src/components/workspace/AIWorkspace.jsx", type: "warn" });
    } else if (cmd.startsWith("npm run")) {
      newLines.push({ text: "Running custom script block...", type: "sys" });
      newLines.push({ text: "Done. Script finished with code 0.", type: "success" });
    } else if (cmd === "help") {
      newLines.push({ text: "Available commands: help, clear, git status, npm run build, node -v, system-metrics", type: "sys" });
    } else {
      newLines.push({ text: `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`, type: "error" });
    }

    setTerminalHistory(newLines);
    setTerminalInput("");
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory]);

  const copyTerminalOutput = () => {
    const text = terminalHistory.map(h => h.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  // Performance telemetry mock values
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memUsage, setMemUsage] = useState(244);
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(Math.floor(10 + Math.random() * 8));
      setMemUsage(Math.floor(240 + Math.random() * 12));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col bg-[#0f1219] border-t border-[#1c2230] select-none ${isMaximized ? 'h-[75vh]' : 'h-[280px]'}`}>
      
      {/* Header bar tabs list */}
      <div className="flex items-center justify-between border-b border-[#1c2230] px-4 py-1.5 bg-[#0c0f16] shrink-0 h-9">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: "terminal", label: "Terminal" },
            { id: "problems", label: "Problems" },
            { id: "git", label: "Git" },
            { id: "output", label: "Output" },
            { id: "logs", label: "Logs" },
            { id: "tasks", label: "AI Tasks" },
            { id: "performance", label: "Performance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all duration-150 cursor-pointer ${
                currentTab === tab.id
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
            title={isMaximized ? "Minimize Panel" : "Maximize Panel"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 ml-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin select-text min-h-0 bg-[#090b10]">
        
        {/* TERMINAL TAB */}
        {currentTab === "terminal" && (
          <div className="flex flex-col h-full font-mono text-[10.5px] leading-relaxed">
            <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1 pr-2 max-h-[190px] min-h-0 text-left">
              {terminalHistory.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.type === "cmd"
                      ? "text-white"
                      : line.type === "success"
                      ? "text-emerald-400"
                      : line.type === "warn"
                      ? "text-amber-400"
                      : line.type === "error"
                      ? "text-rose-400"
                      : "text-gray-500"
                  }
                >
                  {line.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 border-t border-[#1c2230]/40 pt-2 shrink-0 select-none mt-2">
              <span className="text-gray-500 shrink-0">d:\codepilot-ai&gt;</span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full font-mono text-[10.5px]"
                autoFocus
              />
              <button
                type="button"
                onClick={copyTerminalOutput}
                className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
                title="Copy Terminal History"
              >
                {copiedTerminal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        )}

        {/* PROBLEMS TAB */}
        {currentTab === "problems" && (
          <div className="space-y-3 font-mono text-[10px] text-left">
            <div className="flex items-center gap-2 border-b border-[#1c2230]/40 pb-2">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25">
                <AlertCircle className="w-3 h-3" /> 0 Errors
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                <AlertTriangle className="w-3 h-3" /> 1 Warning
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-500/5 border border-amber-500/15 text-gray-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Warning: Unused package imports</span>
                  <p className="text-gray-500 mt-0.5">d:\codepilot-ai\backend\api\auth.py • line 12: imported 'jwt_decoder' but never referenced.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-indigo-500/5 border border-[#1c2230] text-gray-300">
                <span className="text-xs shrink-0 mt-0.5">💡</span>
                <div>
                  <span className="font-bold text-indigo-400">AI Quality Check: Refactoring target</span>
                  <p className="text-gray-500 mt-0.5">Average function length in workspace analytics is high. Recommend extraction of subroutines.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GIT TAB */}
        {currentTab === "git" && (
          <div className="h-full">
            <GitPanel repoPath={repoPath} />
          </div>
        )}

        {/* OUTPUT TAB */}
        {currentTab === "output" && (
          <div className="text-[10px] font-mono text-gray-500 p-1 space-y-1.5 text-left leading-normal">
            <p>[CodePilot Compiler] Scanning source files in local environment...</p>
            <p>[CodePilot Compiler] Successfully indexed {filesList.length} files and {filesList.length * 8} code symbols in vector repository cache.</p>
            <p className="text-emerald-500">[CodePilot Compiler] Success: Workspace compilation complete. 0 errors, 1 warning.</p>
          </div>
        )}

        {/* LOGS TAB */}
        {currentTab === "logs" && (
          <div className="text-[10.5px] font-mono text-gray-500 p-1 space-y-1.5 text-left leading-normal">
            <p className="text-indigo-400">INFO:     127.0.0.1:53123 - "GET /repository/analytics HTTP/1.1" 200 OK</p>
            <p>INFO:     Uvicorn reloading files triggered by WatchFiles change...</p>
            <p>INFO:     Reloader detected change in 'backend/services/analytics_service.py'</p>
            <p className="text-emerald-400">INFO:     Started server process [29452] ready.</p>
          </div>
        )}

        {/* AI TASKS TAB */}
        {currentTab === "tasks" && (
          <div className="space-y-3.5 text-left">
            <div className="flex items-center justify-between border-b border-[#1c2230]/40 pb-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">Active AI Scans</span>
              <span className="text-[8.5px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded">1 Active</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-[#0f1219] border border-[#1c2230] rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-white block">Generating Unit Test Cases</span>
                  <p className="text-[9px] text-gray-500 font-mono">Writing tests suite for 'backend/api/workspace.py'</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[100px] h-1.5 bg-gray-800 rounded-full overflow-hidden select-none">
                    <div className="h-full bg-indigo-500 animate-pulse w-[65%]" />
                  </div>
                  <span className="text-[9.5px] font-mono text-indigo-400 font-bold">65%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {currentTab === "performance" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 bg-[#0f1219] border border-[#1c2230] rounded-xl space-y-1">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-400" /> CPU Usage
              </span>
              <span className="text-sm font-extrabold text-white font-mono">{cpuUsage}%</span>
            </div>

            <div className="p-3 bg-[#0f1219] border border-[#1c2230] rounded-xl space-y-1">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <Database className="w-3 h-3 text-indigo-400" /> RAM Alloc
              </span>
              <span className="text-sm font-extrabold text-white font-mono">{memUsage} MB</span>
            </div>

            <div className="p-3 bg-[#0f1219] border border-[#1c2230] rounded-xl space-y-1">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold">Token Session</span>
              <span className="text-sm font-extrabold text-white font-mono">14,240 tokens</span>
            </div>

            <div className="p-3 bg-[#0f1219] border border-[#1c2230] rounded-xl space-y-1">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold">API Latency</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">180ms</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
