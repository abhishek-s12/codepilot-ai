import { useState } from "react";
import { Bell, BellOff, CheckCircle2 } from "lucide-react";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI indexing database compiled successfully.", time: "2m ago", read: false },
    { id: 2, text: "Security report ready for download.", time: "1h ago", read: true }
  ]);

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-4 select-none text-left font-sans">
      <div className="border-b border-[#1c2230]/40 pb-2 flex justify-between items-center">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-indigo-400" /> Notification Logs Center
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[9px] text-gray-500 hover:text-gray-300 font-mono"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-600 gap-1.5">
            <BellOff className="w-7 h-7 text-gray-700 opacity-60" />
            <p className="text-[10px] italic font-mono">No active alerts or logs.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 bg-[#141822] border rounded-xl flex gap-2.5 items-start transition-all ${
                notif.read ? "border-[#1c2230] text-gray-500" : "border-indigo-500/20 text-gray-300"
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${notif.read ? 'text-gray-600' : 'text-indigo-400'}`} />
              <div className="space-y-0.5 text-[9.5px] font-mono leading-relaxed">
                <p>{notif.text}</p>
                <span className="text-[8px] text-gray-600 block">{notif.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
