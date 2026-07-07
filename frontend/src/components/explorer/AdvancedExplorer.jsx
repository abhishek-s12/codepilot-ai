/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback, useRef } from "react";
import { Folder, FolderOpen, FileCode, Search, Minimize2, Maximize2, Plus, Sparkles, AlertCircle, FileText } from "lucide-react";
import { fetchRepositoryFiles } from "../../services/api";

export default function AdvancedExplorer({
  repoPath,
  selectedPath,
  onOpenFile,
  gitStatus = null,
  onTriggerContextAction,
}) {
  const [tree, setTree] = useState([]);
  const [flatFiles, setFlatFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Expand/collapse state manager
  const [globalExpanded, setGlobalExpanded] = useState(null); // null | true | false
  
  // Hover preview states
  const [hoveredFile, setHoveredFile] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef(null);

  // Context Menu states
  const [contextMenu, setContextMenu] = useState(null); // null | { x, y, path, isDir }

  // Load and build file tree
  const loadFiles = useCallback(async () => {
    if (!repoPath) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRepositoryFiles(repoPath);
      setFlatFiles(res.files || []);

      // Build tree
      const root = { name: "root", isDir: true, children: {} };
      res.files.forEach((file) => {
        const relPath = file.path
          .replace(repoPath, "")
          .replace(/\\/g, "/")
          .replace(/^\//, "");
        const parts = relPath.split("/");

        let current = root;
        parts.forEach((part, index) => {
          const isLast = index === parts.length - 1;
          if (!current.children[part]) {
            current.children[part] = {
              name: part,
              path: file.path,
              extension: file.extension,
              isDir: !isLast,
              children: isLast ? null : {},
            };
          }
          current = current.children[part];
        });
      });

      const convertToArray = (node) => {
        if (!node.isDir) return node;
        const childKeys = Object.keys(node.children);
        node.children = childKeys.map((key) => convertToArray(node.children[key]));
        node.children.sort((a, b) => {
          if (a.isDir && !b.isDir) return -1;
          if (!a.isDir && b.isDir) return 1;
          return a.name.localeCompare(b.name);
        });
        return node;
      };

      const finalTree = convertToArray(root).children;
      setTree(finalTree);
    } catch (err) {
      console.error("Failed to load repo files:", err);
      setError("Failed to load directory files.");
    } finally {
      setLoading(false);
    }
  }, [repoPath]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Handle outside click to close context menu
  useEffect(() => {
    const handleOutsideClick = () => setContextMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter tree nodes recursively based on searchQuery
  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    const cleanQuery = query.toLowerCase();
    
    return nodes
      .map((node) => {
        if (node.isDir) {
          const filteredChildren = filterTree(node.children, query);
          if (filteredChildren.length > 0 || node.name.toLowerCase().includes(cleanQuery)) {
            return { ...node, children: filteredChildren, forceOpen: true };
          }
        } else {
          if (node.name.toLowerCase().includes(cleanQuery)) {
            return node;
          }
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredTree = filterTree(tree, searchQuery);

  // Trigger Context Actions
  const handleContextAction = (actionId, path) => {
    if (onTriggerContextAction) {
      onTriggerContextAction(actionId, path);
    }
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1219] overflow-hidden select-none relative">
      
      {/* File Search Bar */}
      <div className="p-3 border-b border-[#1c2230] bg-[#0c0f16] flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">File Explorer</span>
          
          {/* Toolbar */}
          <div className="flex gap-1">
            <button
              onClick={() => setGlobalExpanded(true)}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
              title="Expand All Folders"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setGlobalExpanded(false)}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
              title="Collapse All Folders"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleContextAction("new_file", repoPath)}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
              title="Create New File"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#090b10] border border-[#1c2230] rounded-lg">
          <Search className="w-3 h-3 text-gray-600 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files..."
            className="bg-transparent border-none outline-none font-mono text-[10px] text-white w-full placeholder-gray-600"
          />
        </div>
      </div>

      {/* Explorer Tree Output */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin min-h-0">
        {loading ? (
          <div className="p-6 text-center text-gray-600 font-mono text-[10px] animate-pulse">Scanning workspace...</div>
        ) : error ? (
          <div className="p-6 text-center text-rose-400 font-mono text-[10px] italic">{error}</div>
        ) : filteredTree.length === 0 ? (
          <div className="p-6 text-center text-gray-600 font-mono text-[10px] italic">No files found</div>
        ) : (
          <div className="space-y-0.5">
            {filteredTree.map((node, index) => (
              <FileTreeNode
                key={index}
                node={node}
                selectedPath={selectedPath}
                onOpenFile={onOpenFile}
                gitStatus={gitStatus}
                globalExpanded={globalExpanded}
                onContextMenu={(e, path, isDir) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setContextMenu({ x: e.clientX, y: e.clientY, path, isDir });
                }}
                onHoverFile={(fileInfo, rect) => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                  if (fileInfo) {
                    hoverTimeoutRef.current = setTimeout(() => {
                      // Lookup LOC details from flat files caching if available
                      const matched = flatFiles.find((f) => f.path === fileInfo.path);
                      setHoveredFile({
                        ...fileInfo,
                        lines: matched?.lines ?? "LOC: N/A",
                        size: matched?.size ? `${(matched.size / 1024).toFixed(1)} KB` : "N/A",
                      });
                      setHoverPosition({ x: rect.right + 10, y: rect.top });
                    }, 500); // 500ms delay
                  } else {
                    setHoveredFile(null);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 bg-[#0f1219] border border-[#1c2230] rounded-xl shadow-2xl p-1.5 min-w-[130px] font-mono text-[10px] space-y-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextAction("explain", contextMenu.path)}
            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-indigo-600 hover:text-white text-gray-300 flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Explain File</span>
          </button>
          <button
            onClick={() => handleContextAction("review", contextMenu.path)}
            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#141822] text-gray-300 flex items-center gap-1.5 border-b border-[#1c2230]/40 pb-1.5 mb-1"
          >
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>Review Code</span>
          </button>
          
          <button
            onClick={() => handleContextAction("rename", contextMenu.path)}
            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white"
          >
            Rename File
          </button>
          <button
            onClick={() => handleContextAction("delete", contextMenu.path)}
            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-600/10 text-rose-400"
          >
            Delete File
          </button>
        </div>
      )}

      {/* Hover Preview Tooltip Card */}
      {hoveredFile && (
        <div
          style={{ top: `${hoverPosition.y}px`, left: `${hoverPosition.x}px` }}
          className="fixed z-50 w-[240px] bg-[#0f1219] border border-[#1c2230] rounded-2xl p-4 shadow-2xl font-sans text-xs space-y-2.5 select-text select-none animate-fade-in pointer-events-none"
        >
          <div className="flex items-center gap-2 border-b border-[#1c2230]/40 pb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white truncate max-w-[170px]">{hoveredFile.name}</span>
          </div>
          <div className="space-y-1.5 text-[10px] text-gray-400 font-mono">
            <div className="flex justify-between">
              <span>Lines count:</span>
              <span className="text-white font-bold">{hoveredFile.lines} LOC</span>
            </div>
            <div className="flex justify-between">
              <span>File size:</span>
              <span className="text-white font-bold">{hoveredFile.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Git Status:</span>
              <span className={`font-bold ${hoveredFile.gitDecoration?.color ?? "text-gray-500"}`}>
                {hoveredFile.gitDecoration?.label ?? "Clean / Tracked"}
              </span>
            </div>
          </div>
          <p className="text-[9.5px] text-gray-500 leading-relaxed pt-1.5 border-t border-[#1c2230]/40">
            Click to view this file. Right click to run audits and AI diagnostics.
          </p>
        </div>
      )}

    </div>
  );
}

function FileTreeNode({
  node,
  selectedPath,
  onOpenFile,
  gitStatus,
  globalExpanded,
  onContextMenu,
  onHoverFile,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Bind forceOpen or global collapse shifts
  useEffect(() => {
    if (node.forceOpen) {
      setIsOpen(true);
    }
  }, [node.forceOpen]);

  useEffect(() => {
    if (globalExpanded !== null && node.isDir) {
      setIsOpen(globalExpanded);
    }
  }, [globalExpanded, node.isDir]);

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
    if (e === ".md") return "text-violet-400";
    return "text-gray-300";
  };

  // Determine Git Decorations state
  const getGitDecoration = () => {
    if (node.isDir || !gitStatus) return null;
    const relPath = node.path.replace(/\\/g, "/");
    
    // Check modified
    const isModified = (gitStatus.unstaged || []).some((f) => {
      const gitRel = f.replace(/\\/g, "/");
      return relPath.endsWith(gitRel);
    });

    if (isModified) {
      return {
        badge: "M",
        color: "text-amber-500",
        label: "Modified",
      };
    }
    return null;
  };

  const gitDecoration = getGitDecoration();
  const isSelected = selectedPath === node.path;

  return (
    <div className="select-none font-mono">
      <div
        ref={ref}
        onClick={handleToggle}
        onContextMenu={(e) => onContextMenu(e, node.path, node.isDir)}
        onMouseEnter={() => {
          if (!node.isDir) {
            const rect = ref.current.getBoundingClientRect();
            onHoverFile({ name: node.name, path: node.path, gitDecoration }, rect);
          }
        }}
        onMouseLeave={() => {
          if (!node.isDir) onHoverFile(null, null);
        }}
        className={`flex items-center gap-2 py-1.5 px-2.5 rounded-xl cursor-pointer transition-all duration-150 text-[11px] justify-between relative group ${
          isSelected
            ? "bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500 shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-white/3"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {node.isDir ? (
            <>
              <span className="text-[8px] text-gray-600 shrink-0 w-2.5 text-center">
                {isOpen ? "▼" : "▶"}
              </span>
              {isOpen ? (
                <FolderOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </>
          ) : (
            <>
              <span className="shrink-0 w-2.5"></span>
              <FileCode className={`w-3.5 h-3.5 shrink-0 ${getFileIconColor(node.extension)}`} />
              <span className={`truncate ${gitDecoration?.color ?? ""}`}>{node.name}</span>
            </>
          )}
        </div>

        {/* Git decoration badge on the right */}
        {gitDecoration && (
          <span className={`text-[8.5px] font-bold font-mono px-1 rounded-sm ${gitDecoration.color} bg-white/3 border border-white/5`}>
            {gitDecoration.badge}
          </span>
        )}
      </div>

      {node.isDir && isOpen && (
        <div className="mt-0.5 border-l border-[#1c2230] ml-3.5 pl-2 space-y-0.5">
          {node.children.map((child, index) => (
            <FileTreeNode
              key={index}
              node={child}
              selectedPath={selectedPath}
              onOpenFile={onOpenFile}
              gitStatus={gitStatus}
              globalExpanded={globalExpanded}
              onContextMenu={onContextMenu}
              onHoverFile={onHoverFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
