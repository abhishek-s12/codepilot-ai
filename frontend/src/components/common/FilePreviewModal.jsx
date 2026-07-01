import { useState } from "react";
import MonacoFileViewer from "../editor/MonacoFileViewer";
import { getEditorLanguage } from "../../utils/editorLanguage";
import { IconCopy, IconCheck } from "../icons/Icons";

export default function FilePreviewModal({ previewFile, previewContent, isPreviewLoading, onClose }) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900/95 border border-white/10 rounded-3xl p-6 flex flex-col max-h-[85vh] shadow-2xl relative animate-fade-in glass">

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
              <p className="text-[10px] text-gray-500 font-mono truncate mt-1 flex items-center gap-1.5">
                <span>{previewFile}</span>
                <button
                  onClick={handleCopyPath}
                  className="hover:text-white transition-all p-0.5 rounded hover:bg-white/5 text-gray-500 flex items-center justify-center inline-flex"
                  title="Copy File Path"
                >
                  {copied ? (
                    <IconCheck className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <IconCopy className="w-3 h-3" />
                  )}
                </button>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold shrink-0"
          >
            ✕ Close
          </button>
        </div>

        <div className="flex-grow bg-black/40 border border-white/5 rounded-2xl p-1 min-h-[380px] overflow-hidden">
          <MonacoFileViewer
            filePath={previewFile}
            content={previewContent}
            loading={isPreviewLoading}
          />
        </div>

      </div>
    </div>
  );
}
