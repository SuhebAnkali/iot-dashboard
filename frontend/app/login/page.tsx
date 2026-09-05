'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

type ServerStatus = 'checking' | 'online' | 'offline';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>('checking');

  useEffect(() => {
    async function checkServer() {
      try {
        const response = await fetch(`${API_URL}/api/health`, { cache: 'no-store' });
        setServerStatus(response.ok ? 'online' : 'offline');
      } catch {
        setServerStatus('offline');
      }
    }

    checkServer();
    const interval = window.setInterval(checkServer, 30000);
    return () => window.clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Access granted.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemoAccount(accountEmail: string, accountPassword: string) {
    setEmail(accountEmail);
    setPassword(accountPassword);
    toast.success('Demo credentials loaded.');
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center md:justify-end px-6 md:px-24 bg-black">
      {/* ----------------- VIBRANT CRYSTAL-CLEAR BACKDROP ----------------- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0 filter brightness-110 contrast-105"
      >
        <source src="/videos/login-close-up.mp4" type="video/mp4" />
        <source src="/videos/Login-page style close-up.mp4" type="video/mp4" />
      </video>

      {/* Top Navigation */}
      <header className="absolute top-6 left-6 md:left-12 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/20 px-3.5 py-1.5 text-xs font-mono text-white hover:bg-black/40 transition"
        >
          ← HOME PORTAL
        </Link>
      </header>

      {/* ----------------- COMPACT & SEE-THROUGH GLASS CARD ----------------- */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 w-full max-w-[340px] rounded-2xl border border-white/25 bg-black/10 backdrop-blur-[2px] p-6 shadow-xl font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
          <div>
            <h1 style={{ color: '#ffffff' }} className="text-base font-bold tracking-widest">
              OPERATOR ACCESS
            </h1>
            <p className="text-[9px] uppercase text-cyan-300 tracking-wider font-semibold">
              RTC SMART CITY • COMMAND DESK
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] bg-black/30 border border-white/15 px-2 py-0.5 rounded-full">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                serverStatus === 'online'
                  ? 'bg-emerald-400'
                  : serverStatus === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            <span style={{ color: '#ffffff' }} className="capitalize">{serverStatus}</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label style={{ color: '#ffffff' }} className="block text-[10px] mb-1 tracking-wider font-semibold">
              OPERATOR IDENTIFIER
            </label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@iot.local"
                className="w-full rounded-lg border border-white/20 bg-black/20 px-8 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition text-[11px]"
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#ffffff' }} className="block text-[10px] mb-1 tracking-wider font-semibold">
              AUTHORIZATION KEY
            </label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-white/20 bg-black/20 px-8 py-2 pr-8 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition text-[11px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 py-2.5 text-slate-950 font-bold tracking-wider transition flex items-center justify-center gap-1.5 text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            {loading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : (
              <>
                AUTHENTICATE SESSION <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Clearance Buttons */}
        <div className="mt-5 pt-3.5 border-t border-white/15 text-[9px]">
          <p style={{ color: '#cbd5e1' }} className="mb-2 tracking-widest uppercase font-semibold">
            Quick Demo Clearances:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('operator@iot.local', 'Operator@123')}
              className="rounded-lg border border-cyan-400/40 bg-black/20 p-2 text-left text-cyan-300 hover:bg-cyan-400/20 transition"
            >
              <p className="font-bold">OPERATOR</p>
              <p style={{ color: '#cbd5e1' }} className="text-[8px]">Full Control</p>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('viewer@iot.local', 'Viewer@123')}
              className="rounded-lg border border-white/20 bg-black/20 p-2 text-left text-white hover:bg-white/10 transition"
            >
              <p className="font-bold">VIEWER</p>
              <p style={{ color: '#cbd5e1' }} className="text-[8px]">Read-Only</p>
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}