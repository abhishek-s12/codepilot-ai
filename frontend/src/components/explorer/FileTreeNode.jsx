import { useState } from "react";
import { IconFolder, IconCode } from "../icons/Icons";

export default function FileTreeNode({ node, selectedPath, onOpenFile }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (node.isDir) {
      setIsOpen(!isOpen);
    } else {
      onOpenFile(node.path);
    }
  };

  const getFileIconColor = (ext) => {
    if (!ext) return "text-gray-400";
    const e = ext.toLowerCase();
    if (e === ".py") return "text-sky-400";
    if (e === ".js" || e === ".jsx") return "text-amber-400";
    if (e === ".ts" || e === ".tsx") return "text-blue-400";
    if (e === ".html") return "text-orange-500";
    if (e === ".css") return "text-teal-400";
    if (e === ".json") return "text-yellow-300";
    if (e === ".go") return "text-cyan-400";
    if (e === ".rs") return "text-orange-400";
    if (e === ".java") return "text-red-400";
    return "text-gray-300";
  };

  const isSelected = selectedPath === node.path;

  return (
    <div className="select-none font-mono">
      <div
        onClick={handleToggle}
        className={`flex items-center gap-2 py-1.5 px-2.5 rounded-xl cursor-pointer transition-all duration-200 text-xs ${
          isSelected
            ? "bg-indigo-600/20 text-indigo-300 font-semibold border-l-2 border-indigo-500 shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {node.isDir ? (
          <>
            <span
              className={`text-[10px] text-gray-500 transition-transform duration-200 shrink-0 w-3 text-center ${
                isOpen ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            <IconFolder className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{node.name}</span>
          </>
        ) : (
          <>
            <span className="shrink-0 w-3"></span>
            <IconCode className={`w-4 h-4 shrink-0 ${getFileIconColor(node.extension)}`} />
            <span className="truncate">{node.name}</span>
          </>
        )}
      </div>

      {node.isDir && isOpen && (
        <div className="mt-1 border-l border-white/5 ml-3.5 pl-2 space-y-1">
          {node.children.map((child, index) => (
            <FileTreeNode
              key={index}
              node={child}
              selectedPath={selectedPath}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
