import { useState, useCallback } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export interface UseToastResult {
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function useToast(): UseToastResult {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return { toasts, showToast };
}
