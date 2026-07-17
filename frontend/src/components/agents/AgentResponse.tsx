import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "../common/CustomSyntaxHighlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ComponentPropsWithoutRef } from "react";

interface AgentResponseProps {
  content: string;
  isStreaming: boolean;
  agentName?: string;
}

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

export default function AgentResponse({ content, isStreaming, agentName }: AgentResponseProps) {
  if (!content && isStreaming) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-dim/5 border border-violet-theme/10">
        <span className="w-3 h-3 border-2 border-violet-theme/30 border-t-violet-500 rounded-full animate-spin shrink-0" />
        <span className="text-[10px] text-violet-theme font-mono">Agent analyzing...</span>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-full flex gap-2">
        {/* Avatar */}
        <div className="shrink-0 w-5 h-5 mt-0.5 rounded bg-violet-theme flex items-center justify-center select-none">
          <span className="text-white text-[7px] font-black uppercase">
            {agentName ? agentName.substring(0, 2) : "AG"}
          </span>
        </div>
        <div className="text-gray-300 text-[11px] leading-relaxed workspace-markdown min-w-0 flex-1">
          <ReactMarkdown
            components={{
              code({ inline, className, children }: CodeProps) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: "8px 0",
                      borderRadius: "8px",
                      fontSize: "10px",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-white/5 px-1 py-0.5 rounded text-violet-theme font-mono text-[10px]">
                    {children}
                  </code>
                );
              },
              p({ children }: { children?: React.ReactNode }) {
                return <p className="mb-2 last:mb-0 text-gray-300">{children}</p>;
              },
              strong({ children }: { children?: React.ReactNode }) {
                return <strong className="text-white font-semibold">{children}</strong>;
              },
              ul({ children }: { children?: React.ReactNode }) {
                return <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>;
              },
              li({ children }: { children?: React.ReactNode }) {
                return <li className="text-gray-300">{children}</li>;
              },
              h3({ children }: { children?: React.ReactNode }) {
                return <h3 className="text-white font-bold text-[12px] mb-1 mt-3">{children}</h3>;
              },
              h4({ children }: { children?: React.ReactNode }) {
                return <h4 className="text-violet-theme font-bold text-[11px] mb-1 mt-3 uppercase tracking-wider">{children}</h4>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-1.5 h-3.5 bg-violet-400 rounded-sm ml-0.5 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
