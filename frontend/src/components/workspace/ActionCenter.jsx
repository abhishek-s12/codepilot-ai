/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { BookOpen, Play, Bug, Flame, Shield, HelpCircle, Code, ListCheck, Loader2 } from "lucide-react";

export default function ActionCenter({
  activeFile,
  onTriggerAction,
  workflowState = null, // null | { step: number, status: 'running' | 'done' }
}) {
  const activeFileName = activeFile ? activeFile.split(/[\\/]/).pop() : "";

  // Core Smart Actions
  const smartActions = [
    {
      id: "explain",
      title: "Explain File",
      desc: "Understand file logic and its architecture role.",
      icon: BookOpen,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      prompt: `Explain the file ${activeFileName || "active workspace"} and its structural flows.`,
    },
    {
      id: "tests",
      title: "Generate Tests",
      desc: "Produce unit tests for public declarations.",
      icon: Play,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      prompt: `Generate comprehensive unit tests for the functions in ${activeFileName || "active file"}.`,
    },
    {
      id: "bugs",
      title: "Find Bugs",
      desc: "Identify logical issues and memory leaks.",
      icon: Bug,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      prompt: `Scan for hidden logical errors, syntax issues, and edge case bugs in ${activeFileName || "active file"}.`,
    },
    {
      id: "refactor",
      title: "Refactor Code",
      desc: "Improve cyclomatic complexity and readability.",
      icon: Flame,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      prompt: `Refactor the code in ${activeFileName || "active file"} to improve cyclomatic complexity and adhere to clean code principles.`,
    },
    {
      id: "doc",
      title: "Document File",
      desc: "Generate professional docstrings and summaries.",
      icon: Code,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      prompt: `Generate developer documentation, comments, and docstrings for ${activeFileName || "active file"}.`,
    },
    {
      id: "security",
      title: "Security Audit",
      desc: "Scan for raw secrets and vulnerable modules.",
      icon: Shield,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      prompt: `Perform a security review of ${activeFileName || "active file"}. Look for hardcoded keys, secrets, injection vectors, and weak patterns.`,
    },
  ];

  // Context-Aware Suggestions based on file metadata
  const [contextSuggestions, setContextSuggestions] = useState([]);

  useEffect(() => {
    if (!activeFile) {
      setContextSuggestions([
        {
          label: "Analyze Workspace Directory",
          prompt: "Analyze the active directory hierarchy and identify the main entry point and layer separations.",
        },
        {
          label: "Audit Configuration Diffs",
          prompt: "Examine active git status configurations and identify modified codeblocks.",
        },
      ]);
      return;
    }

    const ext = activeFile.split(".").pop().toLowerCase();
    const fileName = activeFile.split(/[\\/]/).pop().toLowerCase();

    if (fileName === "package.json") {
      setContextSuggestions([
        {
          label: "🔍 Explain Dependencies",
          prompt: "List all main packages in package.json and summarize what they are used for.",
        },
        {
          label: "⚠️ Audit Package Security",
          prompt: "Scan package.json dependencies for known vulnerabilities and suggest version upgrades.",
        },
        {
          label: "🗑️ Find Unused Libraries",
          prompt: "Analyze imports in the codebase and verify if any libraries in package.json are completely unused.",
        },
      ]);
    } else if (fileName === "requirements.txt") {
      setContextSuggestions([
        {
          label: "🐍 Explain Python Packages",
          prompt: "Analyze requirements.txt and describe the role of each library listed.",
        },
        {
          label: "📦 Verify Package Versions",
          prompt: "Review package listings in requirements.txt and check for legacy or incompatible versions.",
        },
      ]);
    } else if (ext === "py") {
      setContextSuggestions([
        {
          label: "🧼 Review PEP-8 Conformity",
          prompt: "Inspect active python file and identify styling, typing, or linting deviations from PEP-8.",
        },
        {
          label: "⚡ Optimize Python Imports",
          prompt: "Check import statements. Are there unused imports or modules that could be lazy loaded?",
        },
        {
          label: "🧩 Explain AST Chunking Structure",
          prompt: "Summarize the classes, methods, and decorators defined in this python module.",
        },
      ]);
    } else if (["js", "jsx", "ts", "tsx"].includes(ext)) {
      setContextSuggestions([
        {
          label: "⚛️ Verify React Hooks Usage",
          prompt: "Review React hook dependency arrays, callback configurations, and potential infinite rendering loops.",
        },
        {
          label: "🎨 Check CSS/Styling Classes",
          prompt: "Analyze CSS custom property mappings or Tailwind classes in this UI module to ensure consistent styling.",
        },
        {
          label: "📦 Audit Export Definitions",
          prompt: "Scan default and named exports. Are there circular dependencies or invalid export paths?",
        },
      ]);
    } else {
      setContextSuggestions([
        {
          label: "📋 Explain File Semantics",
          prompt: `Summarize the contents, type, and purpose of the file ${fileName}.`,
        },
        {
          label: "🔍 Search References",
          prompt: `Find all imports or usage calls references to the file ${fileName} in this codebase.`,
        },
      ]);
    }
  }, [activeFile]);

  // Stepper steps for simulated streaming workflow progress
  const workflowSteps = [
    "Reading file content & structure...",
    "Scanning AST nodes and definitions...",
    "Analyzing local imports & relationships...",
    "Compiling AI review recommendations...",
    "Formulating proposed improvements...",
  ];

  return (
    <div className="space-y-5 p-4 rounded-2xl bg-[#0f1219]/30 border border-[#1c2230] select-none text-left">
      
      {/* Workflow Progress Stepper (Only active when workflowState is provided) */}
      {workflowState && (
        <div className="bg-[#141822] border border-[#1c2230] rounded-xl p-4.5 space-y-3.5 shadow animate-fade-in">
          <div className="flex items-center gap-2 border-b border-[#1c2230]/40 pb-2">
            <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
              Executing AI Workflow...
            </span>
          </div>

          <div className="space-y-2">
            {workflowSteps.map((stepText, idx) => {
              const isCompleted = idx < workflowState.step;
              const isCurrent = idx === workflowState.step;
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
      )}

      {/* Suggested Actions Title */}
      <div className="flex items-center gap-1.5 text-indigo-400 font-bold font-mono text-[9px] uppercase tracking-widest border-b border-[#1c2230]/40 pb-2">
        <ListCheck className="w-3.5 h-3.5" />
        <span>AI Workspace Actions</span>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {smartActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onTriggerAction(action.prompt)}
              className="group text-left p-3.5 rounded-xl bg-[#141822] hover:bg-[#1b212f] border border-[#1c2230] hover:border-indigo-500/25 transition-all shadow cursor-pointer flex flex-col gap-2.5 duration-200"
            >
              <div className={`w-8 h-8 rounded-lg ${action.bg} ${action.border} border flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${action.color}`} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-bold text-white group-hover:text-indigo-400 transition-colors font-sans">{action.title}</h4>
                <p className="text-[8.5px] text-gray-500 leading-normal font-sans">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Context-Aware Suggestions Section */}
      <div className="space-y-2 pt-2 border-t border-[#1c2230]/40">
        <div className="flex items-center gap-1 text-[8.5px] font-mono font-bold uppercase text-gray-500 tracking-wider">
          <HelpCircle className="w-3 h-3 text-gray-500" />
          <span>Context Suggestions ({activeFileName || "Repo"})</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {contextSuggestions.map((suggest, idx) => (
            <button
              key={idx}
              onClick={() => onTriggerAction(suggest.prompt)}
              className="w-full text-left p-2 rounded-lg border border-[#1c2230] hover:border-indigo-500/20 hover:bg-[#141822] text-[9.5px] text-gray-400 hover:text-white transition-all font-mono truncate"
            >
              {suggest.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
