import { IconSparkles } from "../icons/Icons";

export default function LoginScreen({
  showSandboxForm,
  sandboxName,
  sandboxEmail,
  onSandboxNameChange,
  onSandboxEmailChange,
  onToggleSandboxForm,
  onSandboxLogin,
}) {
  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-6 overflow-hidden">
      <div className="glow-orb top-0 right-1/4"></div>
      <div className="glow-orb bottom-0 left-10"></div>

      <div className="w-full max-w-lg glass rounded-3xl border border-white/10 p-8 z-10 relative space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center text-indigo-400 mb-2">
            <IconSparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">CodePilot AI</h1>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Analyze codebases, query architecture, and explore functional execution maps powered by local embeddings and OpenRouter.
          </p>
        </div>

        {!showSandboxForm ? (
          <div className="space-y-4">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/auth/login/github`}
              className="w-full py-3.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </a>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/auth/login/google`}
              className="w-full py-3.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.53 2.87-2.14 5.3-4.57 6.94l7.1 5.51C43.43 36.63 46.5 30.93 46.5 24z"/>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.1-5.51c-1.97 1.32-4.52 2.13-8.79 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </a>

            <div className="flex items-center gap-3.5 my-6 text-gray-600 text-xs">
              <div className="h-px bg-white/5 flex-grow"></div>
              <span>OR</span>
              <div className="h-px bg-white/5 flex-grow"></div>
            </div>

            <button
              onClick={() => onToggleSandboxForm(true)}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-950/20 text-indigo-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              Launch Developer Sandbox Session (No Credentials Needed)
            </button>
          </div>
        ) : (
          <form onSubmit={onSandboxLogin} className="space-y-5">
            <h3 className="text-md font-bold text-white mb-2">Developer Sandbox Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Developer Name</label>
                <input
                  type="text"
                  required
                  value={sandboxName}
                  onChange={(e) => onSandboxNameChange(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Developer Email</label>
                <input
                  type="email"
                  required
                  value={sandboxEmail}
                  onChange={(e) => onSandboxEmailChange(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="flex gap-3.5 pt-4">
              <button
                type="button"
                onClick={() => onToggleSandboxForm(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-grow-2 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs text-white font-bold transition-all shadow-lg shadow-indigo-600/20"
              >
                Configure and Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
