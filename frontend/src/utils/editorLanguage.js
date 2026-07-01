export function getEditorLanguage(filePath) {
  if (!filePath) return "plaintext";
  const parts = filePath.split(".");
  if (parts.length <= 1) return "plaintext";
  const ext = `.${parts.pop().toLowerCase()}`;

  const mapping = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".json": "json",
    ".css": "css",
    ".html": "html",
    ".md": "markdown",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".go": "go",
    ".rs": "rust",
  };

  return mapping[ext] || "plaintext";
}
