'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Droplet, 
  Zap, 
  ShieldAlert, 
  ArrowDown, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Gauge,
  Database,
  TrendingDown,
  AlertOctagon,
  PowerOff
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <main className="relative min-h-screen bg-[#05070c] text-white selection:bg-cyan-500 selection:text-black">
      {/* Fixed Minimalist Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300">
            <Droplet size={18} />
          </div>
          <div>
            <p style={{ color: '#ffffff' }} className="font-mono text-xs font-bold tracking-[0.25em]">
              RTC SMART CITY
            </p>
            <p style={{ color: '#67e8f9' }} className="font-mono text-[9px] uppercase tracking-widest">
              ESP32 &amp; AI Municipal Twin
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-xs font-mono">
          <a href="#problem" style={{ color: '#e2e8f0' }} className="hidden sm:inline hover:text-cyan-300 transition">
            01 PROBLEM STATEMENT
          </a>
          <a href="#water-solution" style={{ color: '#e2e8f0' }} className="hidden sm:inline hover:text-cyan-300 transition">
            02 WATER TWIN
          </a>
          <a href="#lighting-solution" style={{ color: '#e2e8f0' }} className="hidden sm:inline hover:text-cyan-300 transition">
            03 ADAPTIVE LIGHTING
          </a>
          <Link
            href="/login"
            className="rounded-lg bg-cyan-400 px-4 py-2 text-slate-950 font-bold tracking-wider hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            COMMAND CENTER →
          </Link>
        </nav>
      </header>

      {/* ========================================================== */}
      {/* SECTION 1: ESTABLISHING HERO */}
      {/* ========================================================== */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover filter brightness-[0.7] contrast-[1.1]"
        >
          <source src="/videos/city-overview.mp4" type="video/mp4" />
          <source src="/videos/City Overview.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-black/70 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/85 px-4 py-1.5 text-xs font-mono tracking-widest text-cyan-300 mb-6 backdrop-blur-md shadow-lg"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            MEGA PROJECT • RTC + ESP32 + AI DIGITAL TWIN
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight"
          >
            Intelligent Water Distribution &amp; <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
              Adaptive Street Lighting
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl backdrop-blur-md bg-black/85 p-6 rounded-2xl border border-white/20 shadow-2xl"
          >
            <p style={{ color: '#ffffff' }} className="text-sm sm:text-base font-normal leading-relaxed">
              An integrated automation platform that monitors and controls municipal infrastructure in real-time, eliminating operational blind spots through IoT sensors, RTC scheduling, and predictive analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 tracking-wider hover:bg-cyan-300 transition hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            >
              ACCESS DASHBOARD
            </Link>
            <a
              href="#problem"
              className="w-full sm:w-auto rounded-xl border border-white/30 bg-black/85 backdrop-blur-md px-8 py-4 font-semibold text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              PROBLEM STATEMENT <ArrowDown size={14} />
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-widest pointer-events-none">
          <span style={{ color: '#cbd5e1' }}>SCROLL DOWN</span>
          <div className="w-4 h-7 border border-white/40 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 2: THE PROBLEM STATEMENT & REAL-WORLD EVIDENCE */}
      {/* ========================================================== */}
      <section id="problem" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-rose-400 font-bold flex items-center gap-2">
            <ShieldAlert size={14} /> 01 • PROBLEM STATEMENT — MEGA PROJECT
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-light text-white tracking-tight">
            Traditional Municipal Failures
          </h2>
          
          {/* Problem Quote Container */}
          <div className="mt-6 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/80 to-black/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <p style={{ color: '#ffffff' }} className="text-base sm:text-xl leading-relaxed font-light">
              "Traditional water distribution and street lighting systems often operate on fixed schedules and manual control, leading to water wastage, leakage, uneven distribution, unnecessary power consumption, and delayed fault detection."
            </p>
          </div>
        </div>

        {/* Real-World Industry Benchmark Statistics */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="rounded-2xl border border-rose-500/40 bg-black/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: '#e2e8f0' }}>WATER TRANSIT LOSS</span>
              <TrendingDown size={16} className="text-rose-400" />
            </div>
            <p className="text-3xl font-bold text-rose-400 mt-2">35% – 45%</p>
            <p style={{ color: '#ffffff' }} className="text-xs mt-2 font-sans leading-5">
              Treated municipal water lost to physical leaks and distribution ruptures before reaching consumers.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/40 bg-black/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: '#e2e8f0' }}>DETECTION DELAY</span>
              <AlertOctagon size={16} className="text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-400 mt-2">7 – 21 Days</p>
            <p style={{ color: '#ffffff' }} className="text-xs mt-2 font-sans leading-5">
              Typical timeframe to identify underground non-surfacing line leaks without digital sensor telemetry.
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-500/40 bg-black/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: '#e2e8f0' }}>LIGHTING POWER WASTE</span>
              <Zap size={16} className="text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-400 mt-2">25% – 40%</p>
            <p style={{ color: '#ffffff' }} className="text-xs mt-2 font-sans leading-5">
              Electricity wasted when fixed-timer streetlights operate at full intensity during dawn and dusk.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/40 bg-black/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: '#e2e8f0' }}>MOTOR CASUALTIES</span>
              <PowerOff size={16} className="text-rose-400" />
            </div>
            <p className="text-3xl font-bold text-rose-400 mt-2">Frequent</p>
            <p style={{ color: '#ffffff' }} className="text-xs mt-2 font-sans leading-5">
              Pump motors burn out prematurely due to dry-tank operation and erratic pressure surges.
            </p>
          </div>
        </div>

        {/* Video Card */}
        <div className="relative rounded-3xl overflow-hidden border border-rose-500/40 bg-[#0c101c] shadow-2xl">
          <div className="aspect-video w-full max-h-[500px] relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover filter brightness-[0.7]"
            >
              <source src="/videos/anomaly-detection.mp4" type="video/mp4" />
              <source src="/videos/Anomaly Detection.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-transparent to-transparent" />
            
            <div className="absolute top-6 right-6 font-mono text-xs bg-black/90 border border-rose-500/80 backdrop-blur-md px-4 py-2 rounded-xl text-rose-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              BREACH DETECTED: LATERAL BRANCH WARD 02
            </div>
          </div>

          <div className="p-8 sm:p-10 grid sm:grid-cols-3 gap-6 border-t border-white/10 font-mono bg-black/85">
            <div className="bg-white/[0.05] border border-white/10 p-5 rounded-2xl">
              <p className="text-2xl font-bold text-rose-400">UNEVEN</p>
              <p style={{ color: '#ffffff' }} className="text-xs uppercase tracking-wider mt-1 font-semibold">Ward Allocation</p>
              <p style={{ color: '#f1f5f9' }} className="text-xs font-sans mt-2 leading-relaxed">
                Manual gate valves result in tail-end consumers suffering severe pressure drop and dry outlets.
              </p>
            </div>
            <div className="bg-white/[0.05] border border-white/10 p-5 rounded-2xl">
              <p className="text-2xl font-bold text-amber-400">BLIND SPOTS</p>
              <p style={{ color: '#ffffff' }} className="text-xs uppercase tracking-wider mt-1 font-semibold">Fault Isolation</p>
              <p style={{ color: '#f1f5f9' }} className="text-xs font-sans mt-2 leading-relaxed">
                Municipal teams rely on physical complaints instead of real-time flow sensors and acoustic monitors.
              </p>
            </div>
            <div className="bg-white/[0.05] border border-white/10 p-5 rounded-2xl">
              <p className="text-2xl font-bold text-rose-400">INFLEXIBLE</p>
              <p style={{ color: '#ffffff' }} className="text-xs uppercase tracking-wider mt-1 font-semibold">Grid Scheduling</p>
              <p style={{ color: '#f1f5f9' }} className="text-xs font-sans mt-2 leading-relaxed">
                Fixed mechanical timers cannot respond to seasonal daylight shifts or low-traffic night corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 3: THE PROPOSED SOLUTION (MEGA PROJECT SUMMARY) */}
      {/* ========================================================== */}
      <section id="water-solution" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold flex items-center gap-2">
            <Droplet size={14} /> 02 • PROPOSED MEGA PROJECT SOLUTION
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-light text-white tracking-tight">
            IoT &amp; AI-Driven Architecture
          </h2>
          
          <div className="mt-6 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/80 to-black/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <p style={{ color: '#ffffff' }} className="text-base sm:text-xl leading-relaxed font-light">
              "The proposed mega project aims to develop an RTC-Based Intelligent Water Distribution and Adaptive Street Lighting System that uses ESP32, sensors, IoT connectivity, automation, and AI/predictive analytics to monitor and control water distribution and street lighting in real time."
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-light text-white">Full Automation &amp; Centralized Control</h3>
            <p style={{ color: '#ffffff' }} className="mt-3 text-sm sm:text-base leading-relaxed font-normal">
              "The system will enable automatic scheduling, water-flow monitoring, leakage detection, dry-tank protection, adaptive lighting, energy conservation, remote monitoring, alerts, and historical data analysis through a centralized dashboard."
            </p>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/15 p-4 rounded-xl">
                <Clock size={18} className="text-cyan-400 shrink-0" />
                <span style={{ color: '#ffffff' }}>RTC-Based scheduling manages automated water quotas ward-by-ward.</span>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/15 p-4 rounded-xl">
                <Gauge size={18} className="text-cyan-400 shrink-0" />
                <span style={{ color: '#ffffff' }}>Continuous YF-S201 flow telemetry &amp; dry-tank shut-off protection.</span>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/15 p-4 rounded-xl">
                <Database size={18} className="text-cyan-400 shrink-0" />
                <span className="text-cyan-300 font-bold">Live PostgreSQL telemetry synchronization &amp; exportable PDF reports.</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-[#060b14]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
            >
              <source src="/videos/ward-distribution.mp4" type="video/mp4" />
              <source src="/videos/Ward Distribution.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md border border-white/20 p-4 rounded-xl font-mono text-xs flex justify-between">
              <div>
                <p style={{ color: '#cbd5e1' }} className="text-[10px]">WATER TANK</p>
                <p className="text-cyan-300 font-bold">RESERVOIR T-01 (78.4%)</p>
              </div>
              <div>
                <p style={{ color: '#cbd5e1' }} className="text-[10px]">BALANCED WARDS</p>
                <p className="text-emerald-400 font-bold">WARD 01 • 02 • 03</p>
              </div>
              <div>
                <p style={{ color: '#cbd5e1' }} className="text-[10px]">FLOW LOGIC</p>
                <p style={{ color: '#ffffff' }} className="font-bold">SOLENOID VALVES</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 4: ADAPTIVE LIGHTING & AI PREDICTION */}
      {/* ========================================================== */}
      <section id="lighting-solution" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-[#060b14]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
            >
              <source src="/videos/adaptive-lighting.mp4" type="video/mp4" />
              <source src="/videos/Adaptive Lighting.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md border border-white/20 p-4 rounded-xl font-mono text-xs flex justify-between">
              <div>
                <p style={{ color: '#cbd5e1' }} className="text-[10px]">LDR SENSOR</p>
                <p className="text-amber-300 font-bold">AMBIENT RESPONSIVE</p>
              </div>
              <div>
                <p style={{ color: '#cbd5e1' }} className="text-[10px]">ENERGY SAVED</p>
                <p className="text-emerald-400 font-bold">18.4% MEASURED</p>
              </div>
              <div>
                <p style={{ color: '#cbd5e1' }} className="text-[10px]">CONTROLLER</p>
                <p style={{ color: '#ffffff' }} className="font-bold">ESP32 RELAYS</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-2">
              <Zap size={14} /> 03 • ADAPTIVE ENERGY CONSERVATION
            </p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light text-white tracking-tight">
              Dynamic Street Light Optimization
            </h2>
            <p style={{ color: '#ffffff' }} className="mt-4 text-sm sm:text-base leading-relaxed font-normal">
              LDR sensor inputs continuously detect ambient dusk and dawn transitions. Relay controls automatically trigger or dim luminaires, ensuring safety when needed while cutting unnecessary municipal grid consumption.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-white/[0.05] border border-white/15 p-5 rounded-xl">
                <p className="text-amber-300 font-bold text-sm">LDR Sensitivity</p>
                <p style={{ color: '#f1f5f9' }} className="mt-2 font-sans text-xs leading-relaxed">
                  Automatic threshold triggers eliminate human operational error and daytime burning.
                </p>
              </div>
              <div className="bg-white/[0.05] border border-white/15 p-5 rounded-xl">
                <p className="text-cyan-300 font-bold text-sm">ESP32 Autonomy</p>
                <p style={{ color: '#f1f5f9' }} className="mt-2 font-sans text-xs leading-relaxed">
                  Internal hardware timer backups execute schedules even during network dropouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 5: FINAL CALL TO ACTION */}
      {/* ========================================================== */}
      <section className="relative py-28 overflow-hidden border-t border-white/10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover filter brightness-[0.35] contrast-[1.1]"
        >
          <source src="/videos/final-hero.mp4" type="video/mp4" />
          <source src="/videos/Final Hero.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-300 font-bold mb-3">
            CENTRALIZED COMMAND
          </p>
          <h2 className="text-4xl sm:text-6xl font-light text-white tracking-tight">
            Explore the Live Dashboard
          </h2>
          <p style={{ color: '#ffffff' }} className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Monitor real-time sensor streams, toggle motorized valves, configure RTC timing, and view PDF telemetry reports.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 tracking-wider hover:bg-cyan-300 transition hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2"
            >
              LAUNCH OPERATOR ACCESS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Enterprise Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center font-mono text-xs text-slate-300 bg-[#02050a]">
        RTC SMART CITY • Intelligent Water Distribution &amp; Adaptive Street Lighting System
      </footer>
    </main>
  );
}