import { useState } from "react";
import { Link, Check, Globe } from "lucide-react";

export default function ShareWorkspace() {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const generateLink = () => {
    const randomHash = Math.random().toString(36).substring(2, 10);
    const link = `https://codepilot.ai/share/repo-${randomHash}`;
    setShareLink(link);
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-indigo-400" /> Share Workspace View
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">Generate public read-only links for team reference.</p>
      </div>

      <div className="p-3 bg-[#141822] border border-[#1c2230] rounded-xl space-y-3">
        <button
          onClick={generateLink}
          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] font-mono transition-colors cursor-pointer"
        >
          Generate Secure Share Link
        </button>

        {shareLink && (
          <div className="flex gap-2 items-center">
            <input
              readOnly
              value={shareLink}
              className="w-full bg-[#0c0f16] border border-[#1c2230] rounded-xl px-2.5 py-1 text-[9px] font-mono text-gray-400 focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="p-1 rounded bg-[#0c0f16] hover:bg-white/5 border border-[#1c2230] text-gray-400 hover:text-white transition-all cursor-pointer shrink-0"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
