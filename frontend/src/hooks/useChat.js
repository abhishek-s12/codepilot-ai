import { useState, useCallback } from "react";
import { getErrorMessage, API_BASE_URL } from "../services/api";

export default function useChat(repoPath, setStatus) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleAskQuestion = useCallback(async (selectedQuestion = null) => {
    const query = selectedQuestion || question;
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsAsking(true);

    setStatus({
      tone: "loading",
      label: "AI Processing",
      message: "Querying index and drafting response...",
    });

    setChatHistory((prev) => [...prev, { role: "assistant", content: "", sources: [] }]);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("codepilot_token") || ""}`,
        },
        body: JSON.stringify({
          question: query.trim(),
          repo_path: repoPath,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const processLines = (text) => {
        buffer += text;
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep the last incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.type === "sources") {
              setChatHistory((prev) => {
                const list = [...prev];
                list[list.length - 1].sources = parsed.sources;
                return list;
              });
            } else if (parsed.type === "token") {
              setChatHistory((prev) => {
                const list = [...prev];
                list[list.length - 1].content += parsed.token;
                return list;
              });
            } else if (parsed.type === "error") {
              setChatHistory((prev) => {
                const list = [...prev];
                list[list.length - 1].content += `\nError: ${parsed.message}`;
                return list;
              });
            }
          } catch (err) {
            console.warn("Parse stream failure:", err, "raw line:", trimmed);
          }
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (buffer.trim()) processLines("\n");
          break;
        }
        processLines(decoder.decode(value));
      }

      setStatus({
        tone: "success",
        label: "AI Response Completed",
        message: "Streaming completed successfully.",
      });

    } catch (error) {
      console.error(error);
      const errMsg = getErrorMessage(error, "AI assistant was unable to stream response.");
      setChatHistory((prev) => {
        const list = [...prev];
        list[list.length - 1].content = `Error: ${errMsg}`;
        return list;
      });
      setStatus({
        tone: "error",
        label: "System Error",
        message: errMsg,
      });
    } finally {
      setIsAsking(false);
    }
  }, [question, repoPath, setStatus]);

  return {
    question,
    setQuestion,
    chatHistory,
    setChatHistory,
    isAsking,
    setIsAsking,
    handleAskQuestion,
  };
}
