'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const SmartCityScene = dynamic(
  () => import('@/components/landing/SmartCityScene'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[100svh] w-full items-center justify-center bg-[#050b14]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Loading digital twin scene
          </p>
        </div>
      </div>
    ),
  }
);

const heroStats = [
  { label: 'Realtime nodes', value: '148' },
  { label: 'Water wards', value: '03' },
  { label: 'Response visibility', value: '&lt; 3s' },
];

const previewCards = [
  {
    title: 'Live System Preview',
    text: 'Unified operator visibility across water routing, ward states, streetlight corridors, and infrastructure health.',
  },
  {
    title: 'Water Distribution Intelligence',
    text: 'Reservoir, elevated tank, pumping, valves, and underground branches framed as one continuous city service layer.',
  },
  {
    title: 'Adaptive Street Lighting',
    text: 'Ambient-driven lighting zones with corridor emphasis, operational pulse, and premium night-scene presentation.',
  },
];

const waterHighlights = [
  'Reservoir, pump station, tank, and ward network in one scene',
  'Animated pipeline flow with branch logic for Ward 01, Ward 02, and Ward 03',
  'Operational markers for valves, service status, and anomaly visibility',
];

const lightingHighlights = [
  'Streetlight poles aligned to actual road corridors',
  'Night-first illumination language with amber intensity control',
  'Dedicated lighting mode to showcase adaptive city ambience',
];

const architecture = [
  {
    title: 'Field layer',
    items: ['RTC timing', 'ESP32 control', 'LDR sensing', 'Relay and valve actuation'],
  },
  {
    title: 'Control layer',
    items: ['Realtime telemetry', 'Alert logic', 'Infrastructure orchestration', 'Command workflows'],
  },
  {
    title: 'Experience layer',
    items: ['3D digital twin hero', 'Command center access', 'Presentation mode', 'AI anomaly visibility'],
  },
];

const aiSignals = [
  'Pressure irregularity detection across branch pipelines',
  'Action-oriented leak advisory storytelling instead of generic alerts',
  'Demo-ready anomaly framing for technical and executive presentations',
];

const sectionMotion = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: 'easeOut' },
};

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b14]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b14] text-white">
      <section className="relative h-[100svh] min-h-[820px] w-full overflow-hidden">
        <SmartCityScene />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,20,0.88)_0%,rgba(5,11,20,0.6)_30%,rgba(5,11,20,0.18)_62%,rgba(5,11,20,0.65)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.1),transparent_24%),linear-gradient(180deg,rgba(5,11,20,0.12)_0%,rgba(5,11,20,0.2)_55%,rgba(5,11,20,0.9)_100%)]" />

        <header className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <BrandMark />
              </div>
              <div>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">
                  RTC SMART CITY
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  AI-Assisted Urban Infrastructure
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <a
                href="#system-preview"
                className="pointer-events-auto rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                Preview
              </a>
              <Link
                href="/login"
                className="pointer-events-auto rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Command Center
              </Link>
            </div>
          </div>
        </header>

        <div className="absolute inset-0 z-20 flex items-end">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-10 pt-28 md:px-8 lg:grid-cols-[1fr_360px] lg:items-end lg:pb-14">
            <div className="max-w-3xl pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-300 backdrop-blur-xl"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Digital twin hero active
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.06, ease: 'easeOut' }}
                className="mt-8 text-sm font-semibold uppercase tracking-[0.42em] text-cyan-300"
              >
                RTC SMART CITY
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl"
              >
                Intelligent Water Distribution &amp; Adaptive Street Lighting
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.18, ease: 'easeOut' }}
                className="mt-6 max-w-2xl text-base uppercase tracking-[0.24em] text-slate-300 sm:text-lg"
              >
                IoT • AI • Automation • Digital Twin
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.24, ease: 'easeOut' }}
                className="pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#system-preview"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/15"
                >
                  EXPLORE THE CITY →
                </a>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  ENTER COMMAND CENTER
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="pointer-events-none rounded-[28px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
                Scene telemetry
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <p className="font-display text-2xl font-semibold text-cyan-300">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative bg-[linear-gradient(180deg,#050b14_0%,#07111d_100%)]">
        <motion.section
          id="system-preview"
          {...sectionMotion}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow="Live System Preview"
            title="A premium support layer beneath the immersive hero"
            description="After the 3D first impression, the rest of the landing page stays disciplined: concise, industrial, and product-grade."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {previewCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-white/10 bg-[#0b1422]/85 p-6 shadow-glass backdrop-blur-xl"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                  {card.title}
                </p>
                <p className="mt-4 text-sm leading-8 text-slate-300">{card.text}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionMotion} className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:px-8 lg:grid-cols-2">
            <FeaturePanel
              eyebrow="Water Distribution Intelligence"
              title="Hydraulic infrastructure becomes a visible city system"
              items={waterHighlights}
              accent="cyan"
            />
            <FeaturePanel
              eyebrow="Adaptive Street Lighting"
              title="Night operations feel intentional, not decorative"
              items={lightingHighlights}
              accent="amber"
            />
          </div>
        </motion.section>

        <motion.section {...sectionMotion} className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading
            eyebrow="System Architecture"
            title="Hardware, control logic, and operator experience in one product story"
            description="The landing page now frames your mega project as an integrated smart-city platform instead of a collection of disconnected dashboard cards."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {architecture.map((layer, index) => (
              <article
                key={layer.title}
                className="rounded-[28px] border border-white/10 bg-[#0b1422]/85 p-6 shadow-glass backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 font-display text-sm font-semibold text-cyan-300">
                    0{index + 1}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {layer.title}
                  </h3>
                </div>
                <div className="mt-5 space-y-3">
                  {layer.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionMotion} className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
            <SectionHeading
              eyebrow="AI Anomaly Detection"
              title="Operational intelligence is presented as action, not ornament"
              description="Red remains reserved for genuinely critical city events, while the interface emphasizes explainable infrastructure intelligence."
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {aiSignals.map((item, index) => (
                <article
                  key={item}
                  className="rounded-[28px] border border-white/10 bg-[#0b1422]/85 p-6 shadow-glass backdrop-blur-xl"
                >
                  <div className="mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-transparent" />
                  <p className="text-sm leading-8 text-slate-300">{item}</p>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Signal 0{index + 1}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionMotion} className="mx-auto max-w-5xl px-5 py-20 text-center md:px-8">
          <div className="rounded-[32px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(8,15,28,0.98))] px-6 py-14 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Final CTA
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Enter the command center behind the digital twin
            </h2>
            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-400">
              The landing page now leads with a real WebGL city experience while keeping the rest of the product deployment-safe and aligned to serious infrastructure software.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Enter Command Center
              </Link>
              <a
                href="#system-preview"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                Review Platform Layers
              </a>
            </div>
          </div>
        </motion.section>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
            <p>RTC SMART CITY · Intelligent Water Distribution &amp; Adaptive Street Lighting</p>
            <p>3D smart city digital twin landing experience</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 leading-8 text-slate-400">{description}</p>
    </div>
  );
}

function FeaturePanel({
  eyebrow,
  title,
  items,
  accent,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  accent: 'cyan' | 'amber';
}) {
  const accentClass =
    accent === 'cyan'
      ? 'border-cyan-400/15 bg-cyan-400/5 text-cyan-300'
      : 'border-amber-400/15 bg-amber-400/5 text-amber-300';

  const dotClass = accent === 'cyan' ? 'bg-cyan-300' : 'bg-amber-300';

  return (
    <article className="rounded-[30px] border border-white/10 bg-[#0b1422]/88 p-6 shadow-glass backdrop-blur-xl sm:p-7">
      <div className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${accentClass}`}>
        {eyebrow}
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h3>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dotClass}`} />
            <p className="text-sm leading-7 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-none">
      <path d="M16 4L26 10V22L16 28L6 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 10V22M10 13.5L16 17L22 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
