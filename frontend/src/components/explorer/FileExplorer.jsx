import { useEffect, useState } from "react";
import { fetchRepositoryFiles } from "../../services/api";
import FileTreeNode from "./FileTreeNode";

export default function FileExplorer({ repoPath, selectedPath, onOpenFile }) {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repoPath) return;

    const loadFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchRepositoryFiles(repoPath);

        // Reconstruct flat array into tree
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
        setError("Failed to load repository files.");
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [repoPath]);

  return (
    <div className="p-5 rounded-3xl border border-white/10 bg-gray-900/50 backdrop-blur-xl shadow-2xl glass space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 font-mono">
          File Explorer
        </h3>
        {loading && (
          <span className="w-3.5 h-3.5 border border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin inline-block"></span>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 italic py-2">{error}</p>
      ) : tree.length === 0 && !loading ? (
        <p className="text-xs text-gray-500 italic py-2">No files found.</p>
      ) : (
        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
          {tree.map((node, index) => (
            <FileTreeNode
              key={index}
              node={node}
              selectedPath={selectedPath}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
