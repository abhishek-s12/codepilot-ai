export function getEditorLanguage(filePath: string | null | undefined): string {
  if (!filePath) return "plaintext";
  const parts = filePath.split(".");
  if (parts.length <= 1) return "plaintext";
  
  const popped = parts.pop();
  if (!popped) return "plaintext";
  const ext = `.${popped.toLowerCase()}`;

  const mapping: Record<string, string> = {
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
