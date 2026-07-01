import { useState, useRef, useEffect } from "react";
import MonacoFileViewer from "../editor/MonacoFileViewer";
import SymbolExplorer from "../symbols/SymbolExplorer";
import { getEditorLanguage } from "../../utils/editorLanguage";
import { IconCopy, IconCheck } from "../icons/Icons";
import { searchCodebase, fetchFileSymbols } from "../../services/api";

export default function FilePreviewModal({
  previewFile,
  previewContent,
  isPreviewLoading,
  onClose,
  initialLine,
  repoPath,
  onOpenFile,
  onExplainSymbolGlobal,
}) {
  const [copied, setCopied] = useState(false);
  const [activePanel, setActivePanel] = useState("outline"); // "outline" or "references"
  const [references, setReferences] = useState([]);
  const [refSearchWord, setRefSearchWord] = useState("");
  const [isRefLoading, setIsRefLoading] = useState(false);

  const editorRef = useRef(null);

  // Jump to initial line when Monaco loads
  useEffect(() => {
    if (editorRef.current && initialLine) {
      setTimeout(() => {
        const editor = editorRef.current;
        if (editor) {
          editor.revealLineInCenter(initialLine);
          editor.setPosition({ lineNumber: initialLine, column: 1 });
          editor.focus();
        }
      }, 300);
    }
  }, [initialLine, isPreviewLoading]);

  if (!previewFile) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(previewFile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = () => {
    const lang = getEditorLanguage(previewFile);
    return lang.toUpperCase();
  };

  const getByteSizeLabel = () => {
    if (!previewContent) return null;
    const bytes = new Blob([previewContent]).size;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const sizeLabel = getByteSizeLabel();
  const languageLabel = getLanguageLabel();

  // Scroll to symbol definition
  const handleSelectSymbol = (symbol) => {
    const editor = editorRef.current;
    if (editor && symbol.line) {
      editor.revealLineInCenter(symbol.line);
      editor.setPosition({ lineNumber: symbol.line, column: symbol.column || 1 });
      editor.focus();
    }
  };

  // Custom Context Menu: Go To Definition
  const handleGoToDefinition = async (word) => {
    try {
      const searchRes = await searchCodebase(word, repoPath);
      const definition =
        searchRes.find(
          (res) =>
            res.symbol === word &&
            (res.type === "ClassDef" ||
              res.type === "FunctionDef" ||
              res.type === "AsyncFunctionDef")
        ) || searchRes[0];

      if (definition) {
        let line = 1;
        try {
          const syms = await fetchFileSymbols(definition.path);
          const found = syms.find((s) => s.name === word);
          if (found) line = found.line;
        } catch (err) {
          console.error(err);
        }
        onOpenFile(definition.path, line);
      }
    } catch (err) {
      console.error("Go to definition failed:", err);
    }
  };

  // Custom Context Menu: Find References
  const handleFindReferences = async (word) => {
    try {
      setIsRefLoading(true);
      setRefSearchWord(word);
      setActivePanel("references");

      const searchRes = await searchCodebase(word, repoPath);
      const grouped = {};
      searchRes.forEach((res) => {
        if (!grouped[res.path]) {
          grouped[res.path] = {
            path: res.path,
            file: res.file,
            snippets: [],
          };
        }
        grouped[res.path].snippets.push(res);
      });
      setReferences(Object.values(grouped));
    } catch (err) {
      console.error("Find references failed:", err);
    } finally {
      setIsRefLoading(false);
    }
  };

  const handleExplainSymbolLocal = (word) => {
    onExplainSymbolGlobal(word);
    onClose();
  };

  // Breadcrumbs Generator
  const renderBreadcrumbs = () => {
    const relPath = previewFile
      .replace(repoPath || "", "")
      .replace(/\\/g, "/")
      .replace(/^\//, "");
    const parts = relPath.split("/");
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono overflow-x-auto whitespace-nowrap scrollbar-none py-1">
        {parts.map((part, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-gray-700">›</span>}
            <span className="hover:text-gray-300 transition-colors">{part}</span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-slate-900/95 border border-white/10 rounded-3xl p-6 flex flex-col max-h-[85vh] shadow-2xl relative animate-fade-in glass">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono truncate">
                  {previewFile.split("/").pop() || previewFile}
                </h3>
                {languageLabel !== "PLAINTEXT" && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-mono tracking-wider shrink-0">
                    {languageLabel}
                  </span>
                )}
                {sizeLabel && (
                  <span className="px-2 py-0.5 text-[9px] font-medium rounded-md bg-white/5 text-gray-400 border border-white/5 font-mono shrink-0">
                    {sizeLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 min-w-0">
                {renderBreadcrumbs()}
                <button
                  onClick={handleCopyPath}
                  className="hover:text-white transition-all p-0.5 rounded hover:bg-white/5 text-gray-500 flex items-center justify-center shrink-0"
                  title="Copy File Path"
                >
                  {copied ? (
                    <IconCheck className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <IconCopy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold shrink-0"
          >
            ✕ Close
          </button>
        </div>

        {/* Workspace Split Layout */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 min-h-[380px] overflow-hidden">
          
          {/* Left Panel: Monaco Editor */}
          <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-1 overflow-hidden relative">
            <MonacoFileViewer
              filePath={previewFile}
              content={previewContent}
              loading={isPreviewLoading}
              editorRef={editorRef}
              onExplainSymbol={handleExplainSymbolLocal}
              onGoToDefinition={handleGoToDefinition}
              onFindReferences={handleFindReferences}
            />
          </div>

          {/* Right Panel: Symbols Outline / References Pane */}
          <div className="overflow-hidden">
            {activePanel === "outline" ? (
              <SymbolExplorer
                filePath={previewFile}
                loading={isPreviewLoading}
                onSelectSymbol={handleSelectSymbol}
              />
            ) : (
              <div className="flex flex-col h-full bg-slate-900/35 border border-white/5 rounded-2xl p-4 min-h-[380px] shrink-0 overflow-hidden select-none">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                    References: {refSearchWord}
                  </h4>
                  <button
                    onClick={() => setActivePanel("outline")}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-semibold font-mono"
                  >
                    Outline
                  </button>
                </div>
                {isRefLoading ? (
                  <div className="flex items-center justify-center py-10 flex-grow">
                    <span className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></span>
                  </div>
                ) : references.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2">No references found</p>
                ) : (
                  <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                    {references.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-1">
                        <div
                          className="text-[10px] font-bold text-gray-400 font-mono truncate hover:text-white cursor-pointer"
                          title={group.path}
                          onClick={() => onOpenFile(group.path)}
                        >
                          📂 {group.file}
                        </div>
                        <div className="pl-2 space-y-1">
                          {group.snippets.map((snip, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={async () => {
                                let targetLine = 1;
                                try {
                                  const syms = await fetchFileSymbols(group.path);
                                  const found = syms.find((s) => s.name === refSearchWord);
                                  if (found) targetLine = found.line;
                                } catch (err) {
                                  console.error(err);
                                }
                                onOpenFile(group.path, targetLine);
                              }}
                              className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-gray-300 block truncate"
                              title={snip.snippet}
                            >
                              {snip.snippet}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
