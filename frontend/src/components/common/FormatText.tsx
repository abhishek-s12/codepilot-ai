import React from 'react';

interface FormatTextProps {
  text: string | null | undefined;
}

function parseInlineCode(str: string): React.ReactNode[] | string {
  const parts: React.ReactNode[] = [];
  const regex = /`([^`]+)`/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    parts.push(
      <code
        key={match.index}
        className="bg-panel-alt px-1.5 py-0.5 rounded text-secondary font-mono text-[13px] border border-border"
      >
        {match[1]}
      </code>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

export default function FormatText({ text }: FormatTextProps) {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        if (line.trim().startsWith("```")) {
          return null;
        }

        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          const content = line.trim().substring(2);
          return (
            <ul key={idx} className="list-disc pl-5 text-text font-body">
              <li>{parseInlineCode(content)}</li>
            </ul>
          );
        }

        if (line.trim().startsWith("### ")) {
          return (
            <h3 key={idx} className="text-md font-semibold text-secondary mt-4 font-display">
              {line.trim().substring(4)}
            </h3>
          );
        }

        if (line.trim().startsWith("## ")) {
          return (
            <h2 key={idx} className="text-lg font-bold text-violet-400 mt-5 border-b border-border pb-1 font-display">
              {line.trim().substring(3)}
            </h2>
          );
        }

        const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-text pl-2 font-body">
              <span className="text-secondary font-semibold">{numMatch[1]}.</span>
              <div>{parseInlineCode(numMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-text leading-relaxed text-[14px] font-body">
            {parseInlineCode(line)}
          </p>
        );
      })}
    </div>
  );
}
