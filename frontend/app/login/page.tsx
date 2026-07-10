'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Access granted.');
    } catch (err: any) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-4">
      {/* Ambient background grid, like a SCADA control-room wall */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#1FD1C1 1px, transparent 1px), linear-gradient(90deg, #1FD1C1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="panel-card relative z-10 w-full max-w-md p-8"
      >
        <div className="mb-8 flex items-center gap-3">
          <ValveIcon />
          <div>
            <h1 className="font-display text-xl font-semibold text-white">Control Access</h1>
            <p className="gauge-label mt-1">Water &amp; Street Light System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="gauge-label mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-panel-border bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-signal-cyan"
              placeholder="you@ichalkaranji.iot"
            />
          </div>
          <div>
            <label className="gauge-label mb-1.5 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-panel-border bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-signal-cyan"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-signal-cyan py-2.5 font-display font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-panel-border bg-black/20 p-3 text-xs text-slate-400">
          <p className="mb-1 font-semibold text-slate-300">Demo accounts</p>
          <p>Operator: operator@iot.local / Operator@123</p>
          <p>Viewer (read-only): viewer@iot.local / Viewer@123</p>
        </div>
      </motion.div>
    </div>
  );
}

function ValveIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#1FD1C1" strokeWidth="1.5" opacity="0.5" />
      <circle cx="20" cy="20" r="12" stroke="#1FD1C1" strokeWidth="1.5" />
      <path d="M20 8 L20 4 M20 36 L20 32 M8 20 L4 20 M36 20 L32 20" stroke="#1FD1C1" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="4" fill="#1FD1C1" />
    </svg>
  );
}
