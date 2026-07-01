import Editor from "@monaco-editor/react";
import { getEditorLanguage } from "../../utils/editorLanguage";

export default function MonacoFileViewer({ filePath, content, loading }) {
  const language = getEditorLanguage(filePath);

  const options = {
    readOnly: true,
    minimap: { enabled: true },
    wordWrap: "on",
    automaticLayout: true,
    lineNumbers: "on",
    smoothScrolling: true,
    fontSize: 12,
    fontFamily: "JetBrains Mono, Fira Code, Courier New, monospace",
    cursorBlinking: "smooth",
    scrollBeyondLastLine: false,
    renderLineHighlight: "all",
    contextmenu: true,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[380px]">
        <span className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-white/5 bg-[#1e1e1e]">
      <Editor
        height="380px"
        language={language}
        value={content || ""}
        theme="vs-dark"
        options={options}
        loading={
          <div className="flex items-center justify-center h-full">
            <span className="w-6 h-6 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin"></span>
          </div>
        }
      />
    </div>
  );
}
