export const sampleQuestions: string[] = [
  "Which files contain the main API routes?",
  "Explain the structure of the RAG assistant implementation.",
  "How are function calls extracted and resolved in the call graph?",
  "What is the entry point of the FastAPI application?",
];

export const statusTones: Record<string, string> = {
  idle: "border-border bg-panel text-text",
  loading: "border-accent-dim bg-accent-dim/10 text-accent animate-pulse",
  success: "border-success/20 bg-success-bg text-success",
  error: "border-danger/20 bg-danger-bg text-danger",
};
