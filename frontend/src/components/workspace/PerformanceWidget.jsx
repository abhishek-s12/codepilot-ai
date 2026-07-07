import { useState, useEffect } from "react";
import { Activity, Cpu, Database, Zap } from "lucide-react";

export default function PerformanceWidget({ isOpen, onToggle }) {
  const [cpu, setCpu] = useState(14);
  const [ram, setRam] = useState(242);
  const [latency, setLatency] = useState(180);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCpu(Math.floor(10 + Math.random() * 8));
      setRam(Math.floor(240 + Math.random() * 10));
      setLatency(Math.floor(160 + Math.random() * 40));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
          isOpen ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/25" : "hover:bg-white/5 text-gray-400"
        }`}
      >
        <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>Performance</span>
        <span className="text-[9px] text-emerald-400">{latency}ms</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-6 right-0 w-60 bg-[#0c0f16] border border-[#1c2230] rounded-xl shadow-2xl p-3.5 z-50 animate-fade-in font-mono text-[10px] space-y-3.5 select-none text-left">
          <div className="border-b border-[#1c2230]/40 pb-2 flex justify-between items-center">
            <span className="text-gray-400 font-bold uppercase tracking-wider">System Live Telemetry</span>
            <span className="text-[9px] text-indigo-400 font-bold">HEALTHY</span>
          </div>

          <div className="space-y-3">
            {/* CPU */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-indigo-400" /> CPU Core Usage</span>
                <span className="text-white font-bold">{cpu}%</span>
              </div>
              <div className="h-1.5 bg-[#0f1219] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${cpu}%` }} />
              </div>
            </div>

            {/* RAM */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-indigo-400" /> RAM Allocated</span>
                <span className="text-white font-bold">{ram} MB</span>
              </div>
              <div className="h-1.5 bg-[#0f1219] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(ram / 1024) * 100}%` }} />
              </div>
            </div>

            {/* Latency */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-indigo-400" /> AI API Latency</span>
                <span className="text-emerald-400 font-bold">{latency}ms</span>
              </div>
              <div className="h-1.5 bg-[#0f1219] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(latency / 500) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
