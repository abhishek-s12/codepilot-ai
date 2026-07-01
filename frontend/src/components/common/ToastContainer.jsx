// Toast notification container — receives toasts array from App state

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-fade-in pointer-events-auto max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
              : toast.type === "error"
              ? "bg-rose-950/80 border-rose-500/30 text-rose-300"
              : "bg-indigo-950/80 border-indigo-500/30 text-indigo-300"
          }`}
        >
          <span className="text-xs font-medium leading-relaxed">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
