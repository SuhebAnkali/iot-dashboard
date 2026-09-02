'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const heroStats = [
  { value: '24/7', label: 'Operational telemetry' },
  { value: '12', label: 'Field zones visualized' },
  { value: '< 3s', label: 'Alert response visibility' },
];

const liveSignals = [
  {
    label: 'Tank network',
    value: 'Stable',
    detail: 'North reservoir balanced across 3 wards',
    tone: 'green' as const,
  },
  {
    label: 'Street lighting',
    value: 'Adaptive',
    detail: 'Luminaire groups tracking ambient conditions',
    tone: 'cyan' as const,
  },
  {
    label: 'Leak watch',
    value: 'Advisory',
    detail: 'Pressure variance in underground line B-12',
    tone: 'amber' as const,
  },
];

const waterFeatures = [
  {
    title: 'Reservoir to ward visibility',
    description:
      'Present storage, routing, and ward-level delivery as one operational story instead of scattered charts.',
  },
  {
    title: 'Valve and pipeline intelligence',
    description:
      'Highlight active valves, flow direction, feeder paths, and service dependencies in a clear operator view.',
  },
  {
    title: 'Pressure and leak awareness',
    description:
      'Frame anomalies as actionable events with threshold context, severity, and downstream impact areas.',
  },
];

const lightingFeatures = [
  {
    title: 'Adaptive street light orchestration',
    description:
      'Communicate how LDR input, timers, and override logic coordinate ward-wise lighting behaviour.',
  },
  {
    title: 'Day / night command context',
    description:
      'Show the system moving between daylight monitoring and nighttime illumination with deliberate mood changes.',
  },
  {
    title: 'Fault-ready field awareness',
    description:
      'Expose pole groups, power state, and exceptions without turning the page into a cluttered engineering panel.',
  },
];

const previewCards = [
  {
    title: 'Ward command',
    value: '03 active',
    detail: 'Valve sequencing and route balancing',
    tone: 'cyan' as const,
  },
  {
    title: 'Flow telemetry',
    value: '11.8 kL/h',
    detail: 'Distribution trunk currently stable',
    tone: 'green' as const,
  },
  {
    title: 'Lighting grid',
    value: '148 nodes',
    detail: 'Adaptive response by corridor group',
    tone: 'amber' as const,
  },
  {
    title: 'AI anomaly watch',
    value: '02 flags',
    detail: 'Pattern deviation awaiting operator review',
    tone: 'red' as const,
  },
];

const architectureLayers = [
  {
    title: 'Field hardware layer',
    items: ['RTC scheduling', 'ESP32 controllers', 'LDR sensing', 'Relay and valve actuation'],
  },
  {
    title: 'Control and data layer',
    items: ['Realtime ingestion', 'Device messaging', 'Alert rules', 'Event persistence'],
  },
  {
    title: 'Operator experience layer',
    items: ['Digital twin homepage', 'Command dashboard', 'Presentation demo mode', 'Decision support'],
  },
];

const aiHighlights = [
  {
    title: 'Leak anomaly detection demo',
    description:
      'Surface subtle consumption and pressure mismatches as explainable operational warnings, not mystery red badges.',
  },
  {
    title: 'Predictive operating context',
    description:
      'Show how the platform can forecast risk windows, demand spikes, and lighting behaviour from recent telemetry.',
  },
  {
    title: 'Executive presentation mode',
    description:
      'Support smooth camera-like storytelling with premium visuals that work for demos, reviews, and project showcases.',
  },
];

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: 'easeOut' },
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
      <CityBackdrop />

      <header className="relative z-20 border-b border-white/10 bg-[#050b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-glass">
              <BrandMark />
            </div>

            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
                RTC SMART CITY
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                AI-assisted infrastructure control
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a href="#digital-twin" className="transition hover:text-cyan-300">
              Digital Twin
            </a>
            <a href="#capabilities" className="transition hover:text-cyan-300">
              Capabilities
            </a>
            <a href="#architecture" className="transition hover:text-cyan-300">
              Architecture
            </a>
            <a href="#intelligence" className="transition hover:text-cyan-300">
              AI Intelligence
            </a>
          </nav>

          <Link
            href="/login"
            className="rounded-xl border border-cyan-400/20 bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            Operator Login
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-16 md:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div {...sectionMotion}>
            <StatusChip label="Presentation-ready smart city command experience" tone="green" />

            <h1 className="mt-7 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
              RTC SMART CITY
              <span className="mt-4 block text-2xl font-medium leading-tight text-slate-300 sm:text-3xl lg:text-4xl">
                AI-Assisted Water Distribution &amp; Adaptive Street Lighting Platform
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              A cinematic digital twin homepage for a serious municipal IoT platform — designed to feel like an industrial command center, premium SaaS product, and engineering showcase in one experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Launch Operator Access
              </Link>

              <a
                href="#digital-twin"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                Explore System Preview
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-md"
                >
                  <p className="font-display text-2xl font-semibold text-cyan-300">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...sectionMotion}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
            className="relative"
          >
            <DigitalTwinHeroPanel />
          </motion.div>
        </div>
      </section>

      <motion.section
        id="digital-twin"
        {...sectionMotion}
        className="relative z-10 border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionEyebrow label="Smart city digital twin preview" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A homepage that previews the city system before the operator even signs in
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-400">
              The landing page should immediately communicate a connected urban infrastructure model: live water paths, ward visibility, adaptive lighting zones, and control-room confidence — without needing heavy 3D libraries yet.
            </p>

            <div className="mt-8 space-y-4">
              {liveSignals.map((signal) => (
                <SignalRow key={signal.label} {...signal} />
              ))}
            </div>
          </div>

          <DigitalTwinScene />
        </div>
      </motion.section>

      <motion.section
        id="capabilities"
        {...sectionMotion}
        className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <FeatureColumn
            title="Water distribution intelligence"
            eyebrow="Hydraulic operations"
            description="Turn tanks, underground pipelines, distribution wards, and valve states into a polished operational narrative."
            features={waterFeatures}
            accent="cyan"
          />

          <FeatureColumn
            title="Adaptive street lighting control"
            eyebrow="Lighting automation"
            description="Show a disciplined municipal lighting system with ambient awareness, timed logic, and night-operations clarity."
            features={lightingFeatures}
            accent="amber"
          />
        </div>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="relative z-10 border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionEyebrow label="Live system preview cards" />
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Premium telemetry cards instead of generic student dashboard tiles
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-500">
              Preview mode · cinematic control surface
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {previewCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <PreviewMetricCard {...card} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <SystemStripCard />
            <PresentationModeCard />
          </div>
        </div>
      </motion.section>

      <motion.section
        id="architecture"
        {...sectionMotion}
        className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionEyebrow label="Hardware + software architecture" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              One product story from field hardware to operator command center
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-400">
              The homepage should explain the platform stack visually: sensing and actuation in the field, real-time control services in the middle, and decision-ready operator interfaces at the top.
            </p>
          </div>

          <div className="grid gap-4">
            {architectureLayers.map((layer, index) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <ArchitectureLayer {...layer} index={index + 1} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="intelligence"
        {...sectionMotion}
        className="relative z-10 border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="rounded-[28px] border border-white/10 bg-[#0b1422]/90 p-6 shadow-glass backdrop-blur-xl sm:p-8">
              <SectionEyebrow label="AI intelligence layer" />
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Serious AI framing for anomalies, decision support, and demo storytelling
              </h2>
              <div className="mt-8 space-y-4">
                {aiHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <AiCommandPreview />
          </div>
        </div>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="relative z-10 mx-auto max-w-5xl px-5 py-20 text-center md:px-8"
      >
        <div className="rounded-[32px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(8,15,28,0.96))] px-6 py-14 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:px-10">
          <SectionEyebrow label="Final call to action" centered />
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Position the platform like a real smart-city control product
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-400">
            This landing page establishes the premium identity first — cinematic, technical, and deployment-safe — while leaving existing authentication, backend services, and dashboard workflows untouched.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Continue to Login
            </Link>
            <a
              href="#capabilities"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-7 py-3.5 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
            >
              Review Platform Highlights
            </a>
          </div>
        </div>
      </motion.section>

      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>RTC SMART CITY · Water distribution and adaptive street lighting</p>
          <p>Industrial IoT command center experience</p>
        </div>
      </footer>
    </main>
  );
}

function CityBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(27,92,125,0.14),transparent_34%),linear-gradient(180deg,#050b14_0%,#06101b_52%,#050b14_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(89,129,160,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(89,129,160,0.35) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 82%)',
        }}
      />
      <div className="absolute left-[-10%] top-[-8%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-[-12%] top-[12%] h-[24rem] w-[24rem] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-[-14%] left-[28%] h-[26rem] w-[26rem] rounded-full bg-emerald-400/5 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#02060d] to-transparent" />
    </div>
  );
}

function DigitalTwinHeroPanel() {
  return (
    <div className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,20,34,0.92),rgba(6,12,22,0.96))] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-sm font-semibold text-white">Digital Twin Overview</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            City operations preview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusChip label="System online" tone="green" compact />
          <StatusChip label="Demo mode" tone="cyan" compact />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_220px]">
        <HeroSceneCanvas />
        <div className="grid gap-4">
          <MiniTelemetryPanel
            title="City mode"
            value="Night shift"
            detail="Adaptive lighting priority active"
          />
          <MiniTelemetryPanel
            title="Reservoir level"
            value="72.4%"
            detail="Balanced for current schedule"
          />
          <MiniTelemetryPanel
            title="Anomaly scan"
            value="1 advisory"
            detail="Underground branch pressure drift"
            tone="amber"
          />
        </div>
      </div>
    </div>
  );
}

function HeroSceneCanvas() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_28%),linear-gradient(180deg,rgba(6,12,22,0.92),rgba(9,16,28,0.98))] p-4">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cyan-400/5 to-transparent" />

      <div className="absolute left-4 right-4 top-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-4 py-3 backdrop-blur-md">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Realtime city mesh
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Reservoir · pipeline · wards · lighting grid
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Camera 01</p>
          <p className="mt-1 text-cyan-300">SCADA sweep</p>
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-6 top-24">
        <div className="absolute left-1/2 top-[5%] h-[82%] w-[82%] -translate-x-1/2 [perspective:1400px]">
          <motion.div
            animate={{ rotateX: [64, 62, 64], rotateZ: [-20, -18, -20] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[34px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(8,15,26,0.75),rgba(4,9,16,0.96))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 rounded-[34px] opacity-45 [background-image:linear-gradient(rgba(56,189,248,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px)] [background-size:54px_54px]" />

            <PipelineLine className="left-[19%] top-[26%] w-[29%]" delay={0} />
            <PipelineLine className="left-[45%] top-[26%] w-[26%]" delay={1.3} />
            <PipelineLine className="left-[36%] top-[49%] w-[30%]" delay={0.8} />

            <FacilityBlock className="left-[10%] top-[18%] h-16 w-16" label="Tank A" tone="cyan" />
            <FacilityBlock className="left-[36%] top-[19%] h-14 w-20" label="Ward 01" tone="green" />
            <FacilityBlock className="left-[60%] top-[21%] h-16 w-20" label="Ward 02" tone="green" />
            <FacilityBlock className="left-[30%] top-[44%] h-16 w-24" label="Valve Grid" tone="cyan" />
            <FacilityBlock className="left-[57%] top-[47%] h-16 w-24" label="Ward 03" tone="amber" />
            <FacilityBlock className="left-[17%] top-[58%] h-14 w-20" label="Pump" tone="cyan" />
            <FacilityBlock className="left-[69%] top-[60%] h-16 w-16" label="LDR" tone="amber" />

            <StreetLights />
            <FlowPulse className="left-[20%] top-[24%]" delay={0.2} />
            <FlowPulse className="left-[47%] top-[24%]" delay={1} />
            <FlowPulse className="left-[54%] top-[47%]" delay={1.7} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DigitalTwinScene() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[#0b1422]/90 p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-white/10 bg-black/15 p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-sm font-semibold text-white">City topology preview</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Simplified pseudo-3D composition
              </p>
            </div>
            <StatusChip label="Smooth scene transitions" tone="cyan" compact />
          </div>

          <div className="mt-4 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,11,20,0.85),rgba(7,15,26,0.95))] p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <TopologyStat title="Underground lines" value="08" />
              <TopologyStat title="Ward nodes" value="12" />
              <TopologyStat title="Light corridors" value="06" />
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-glow" />
                <p className="text-sm text-slate-300">
                  Water flow paths glow softly through the underground distribution network.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-amber-300" />
                <p className="text-sm text-slate-300">
                  Lighting corridors shift intensity based on ambient conditions and schedule state.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <SceneSideCard
            title="Water layer"
            value="Route synchronized"
            detail="Tank, feeder, ward, valve, and anomaly callouts"
          />
          <SceneSideCard
            title="Lighting layer"
            value="Night optimisation"
            detail="Adaptive pole groups with fault-aware context"
            tone="amber"
          />
          <SceneSideCard
            title="Operator motion"
            value="Cinematic"
            detail="Structured sections that feel like guided camera cuts"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureColumn({
  title,
  eyebrow,
  description,
  features,
  accent,
}: {
  title: string;
  eyebrow: string;
  description: string;
  features: { title: string; description: string }[];
  accent: 'cyan' | 'amber';
}) {
  const accentClass =
    accent === 'cyan'
      ? 'border-cyan-400/15 bg-cyan-400/5 text-cyan-300'
      : 'border-amber-400/15 bg-amber-400/5 text-amber-300';

  return (
    <div className="rounded-[30px] border border-white/10 bg-[#0b1422]/90 p-6 shadow-glass backdrop-blur-xl sm:p-7">
      <div className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${accentClass}`}>
        {eyebrow}
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h3>
      <p className="mt-4 max-w-2xl leading-8 text-slate-400">{description}</p>

      <div className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full ${accent === 'cyan' ? 'bg-cyan-300' : 'bg-amber-300'}`} />
              <div>
                <p className="text-base font-semibold text-white">{feature.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function PreviewMetricCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: 'cyan' | 'green' | 'amber' | 'red';
}) {
  const toneClasses = {
    cyan: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
    green: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    amber: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    red: 'bg-red-400/10 text-red-300 border-red-400/20',
  };

  return (
    <article className="rounded-[26px] border border-white/10 bg-[#0b1422]/90 p-5 shadow-glass backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${toneClasses[tone]}`}>
          live
        </span>
      </div>
      <p className="mt-5 font-display text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{detail}</p>
    </article>
  );
}

function SystemStripCard() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1422]/90 p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">System route preview</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Hardware to operator visibility
          </p>
        </div>
        <StatusChip label="Realtime orchestration" tone="green" compact />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {['RTC + sensors', 'Control logic', 'Live telemetry', 'Operator action'].map((item, index) => (
          <div
            key={item}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                0{index + 1}
              </span>
              {index < 3 && <span className="hidden text-cyan-300 md:block">→</span>}
            </div>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PresentationModeCard() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1422]/90 p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Presentation demo mode</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Executive showcase behaviour
          </p>
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Guided
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <TimelineStep title="Scene intro" detail="City overview with calm ambient telemetry" />
        <TimelineStep title="Water focus" detail="Tank, pipeline, and ward flow emphasis" />
        <TimelineStep title="Lighting focus" detail="Day-to-night corridor adaptation story" />
        <TimelineStep title="AI advisory" detail="Leak watch and operator recommendation" />
      </div>
    </div>
  );
}

function ArchitectureLayer({
  title,
  items,
  index,
}: {
  title: string;
  items: string[];
  index: number;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[#0b1422]/90 p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 font-display text-sm font-semibold text-cyan-300">
            0{index}
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">Integrated product layer</p>
          </div>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:max-w-40" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}

function AiCommandPreview() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[#0b1422]/90 p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,11,20,0.75),rgba(8,15,28,0.96))] p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm font-semibold text-white">AI operations console</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Explainable anomaly narrative
            </p>
          </div>
          <StatusChip label="Inference active" tone="cyan" compact />
        </div>

        <div className="mt-5 space-y-4">
          <AiEventCard
            title="Pressure deviation"
            detail="Underground branch B-12 shows a sustained variance from expected distribution pattern."
            tone="amber"
          />
          <AiEventCard
            title="Suggested operator action"
            detail="Inspect feeder valve cluster and compare schedule transition timestamp with tank outflow trend."
            tone="cyan"
          />
          <AiEventCard
            title="City impact window"
            detail="Potential service imbalance may affect Ward 02 and Ward 03 if deviation persists beyond the next cycle."
            tone="red"
          />
        </div>
      </div>
    </div>
  );
}

function SectionEyebrow({
  label,
  centered,
}: {
  label: string;
  centered?: boolean;
}) {
  return (
    <p
      className={`text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300 ${
        centered ? 'text-center' : ''
      }`}
    >
      {label}
    </p>
  );
}

function StatusChip({
  label,
  tone,
  compact,
}: {
  label: string;
  tone: 'cyan' | 'green' | 'amber' | 'red';
  compact?: boolean;
}) {
  const toneClasses = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    red: 'border-red-400/20 bg-red-400/10 text-red-300',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${toneClasses[tone]} ${
        compact ? 'px-3 py-1 text-[10px]' : 'px-4 py-2 text-xs'
      } font-medium uppercase tracking-[0.2em]`}
    >
      <span className={`h-2 w-2 rounded-full ${tone === 'green' ? 'bg-emerald-400' : tone === 'cyan' ? 'bg-cyan-300' : tone === 'amber' ? 'bg-amber-300' : 'bg-red-400'}`} />
      {label}
    </div>
  );
}

function SignalRow({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: 'cyan' | 'green' | 'amber';
}) {
  const toneClasses = {
    cyan: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
    green: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    amber: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0b1422]/80 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{detail}</p>
      </div>
      <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses[tone]}`}>
        {value}
      </span>
    </div>
  );
}

function MiniTelemetryPanel({
  title,
  value,
  detail,
  tone = 'cyan',
}: {
  title: string;
  value: string;
  detail: string;
  tone?: 'cyan' | 'amber';
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className={`mt-3 font-display text-2xl font-semibold ${tone === 'amber' ? 'text-amber-300' : 'text-white'}`}>
        {value}
      </p>
      <p className="mt-2 text-xs leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function TopologyStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SceneSideCard({
  title,
  value,
  detail,
  tone = 'cyan',
}: {
  title: string;
  value: string;
  detail: string;
  tone?: 'cyan' | 'amber';
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/15 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className={`mt-3 text-lg font-semibold ${tone === 'amber' ? 'text-amber-300' : 'text-white'}`}>
        {value}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-400">{detail}</p>
    </div>
  );
}

function TimelineStep({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-7 text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

function AiEventCard({
  title,
  detail,
  tone,
}: {
  title: string;
  detail: string;
  tone: 'cyan' | 'amber' | 'red';
}) {
  const toneBar = {
    cyan: 'bg-cyan-300',
    amber: 'bg-amber-300',
    red: 'bg-red-400',
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className={`mt-1 h-10 w-1 rounded-full ${toneBar[tone]}`} />
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm leading-7 text-slate-400">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function PipelineLine({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) {
  return (
    <div className={`absolute h-[8px] rounded-full bg-cyan-500/10 ${className}`}>
      <motion.div
        initial={{ x: '-25%', opacity: 0.3 }}
        animate={{ x: ['-25%', '105%'], opacity: [0.25, 0.9, 0.25] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', delay }}
        className="h-full w-14 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
      />
    </div>
  );
}

function FlowPulse({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.2, scale: 0.85 }}
      animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.85, 1.1, 0.85] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute h-4 w-4 rounded-full border border-cyan-300/40 bg-cyan-300/20 ${className}`}
    />
  );
}

function FacilityBlock({
  className,
  label,
  tone,
}: {
  className: string;
  label: string;
  tone: 'cyan' | 'green' | 'amber';
}) {
  const toneStyles = {
    cyan: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`absolute rounded-2xl border px-3 py-2 shadow-[0_18px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm ${toneStyles[tone]} ${className}`}
    >
      <div className="h-full rounded-xl border border-white/10 bg-black/10 px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {label}
      </div>
    </motion.div>
  );
}

function StreetLights() {
  return (
    <>
      {[
        'left-[16%] top-[76%]',
        'left-[30%] top-[74%]',
        'left-[44%] top-[72%]',
        'left-[58%] top-[70%]',
        'left-[72%] top-[68%]',
      ].map((position, index) => (
        <motion.div
          key={position}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }}
          className={`absolute ${position}`}
        >
          <div className="h-10 w-[2px] bg-slate-500/80" />
          <div className="absolute -left-[7px] top-0 h-4 w-4 rounded-full bg-amber-300/80 shadow-[0_0_18px_rgba(245,158,11,0.45)]" />
        </motion.div>
      ))}
    </>
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
