'use client';

import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ connected }: { connected: boolean }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-panel-border bg-base/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${connected ? 'bg-signal-cyan' : 'bg-signal-red animate-pulse'}`} />
        <div>
          <h1 className="font-display text-base font-semibold text-white">Water &amp; Street Light Control</h1>
          <p className="gauge-label">{connected ? 'Live feed connected' : 'Reconnecting…'}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-3 border-l border-panel-border pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <span
                className={`gauge-label rounded px-1.5 py-0.5 ${
                  user.role === 'operator' ? 'bg-signal-blue/20 text-signal-blue' : 'bg-signal-steel/20 text-signal-steel'
                }`}
              >
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-panel-border px-3 py-1.5 text-sm text-slate-300 transition hover:border-signal-red hover:text-signal-red"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
