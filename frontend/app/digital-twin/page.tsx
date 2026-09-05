// app/digital-twin/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ShieldAlert,
  Activity,
  Droplet,
  Zap,
  CheckCircle2,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { SCENES, SceneConfig } from "@/components/digital-twin/cinematicData";

export default function DigitalTwinPage() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeVideoSlot, setActiveVideoSlot] = useState<"A" | "B">("A");
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [valveOverride, setValveOverride] = useState(false);

  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  const currentScene: SceneConfig = SCENES[currentSceneIdx];

  // Cross-fade pre-buffered transition engine
  const transitionToScene = (nextIdx: number) => {
    if (nextIdx >= SCENES.length) {
      nextIdx = 0; // Loop or hold at final scene
    }
    const nextScene = SCENES[nextIdx];

    if (activeVideoSlot === "A") {
      if (videoRefB.current) {
        videoRefB.current.src = nextScene.videoSrc;
        videoRefB.current.currentTime = 0;
        videoRefB.current.play().catch(() => {});
        setActiveVideoSlot("B");
      }
    } else {
      if (videoRefA.current) {
        videoRefA.current.src = nextScene.videoSrc;
        videoRefA.current.currentTime = 0;
        videoRefA.current.play().catch(() => {});
        setActiveVideoSlot("A");
      }
    }
    setCurrentSceneIdx(nextIdx);
  };

  const handleVideoEnded = () => {
    if (isPlaying && !interactiveMode) {
      transitionToScene(currentSceneIdx + 1);
    }
  };

  const togglePlayPause = () => {
    const activeEl = activeVideoSlot === "A" ? videoRefA.current : videoRefB.current;
    if (activeEl) {
      if (isPlaying) {
        activeEl.pause();
      } else {
        activeEl.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070c] text-white select-none font-sans">
      {/* ----------------- SEAMLESS VIDEO STACK ----------------- */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRefA}
          src={SCENES[0].videoSrc}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeVideoSlot === "A" ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
        <video
          ref={videoRefB}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeVideoSlot === "B" ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />

        {/* Industrial Vignette and Color Grading Filter */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,7,12,0.85)_100%)]" />
        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(180deg,rgba(5,7,12,0.6)_0%,transparent_20%,transparent_80%,rgba(5,7,12,0.85)_100%)]" />
      </div>

      {/* ----------------- INTERACTIVE SPATIAL HUD CALLOUTS ----------------- */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {currentScene.hudCallouts?.map((spot, i) => (
            <motion.div
              key={`${currentScene.id}-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              style={{ left: spot.x, top: spot.y }}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="relative flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span
                    className={`animate-ping absolute h-6 w-6 rounded-full opacity-75 ${
                      spot.tone === "rose" ? "bg-rose-500" : spot.tone === "amber" ? "bg-amber-400" : "bg-cyan-400"
                    }`}
                  />
                  <span
                    className={`relative rounded-full h-3 w-3 border-2 border-black ${
                      spot.tone === "rose" ? "bg-rose-500" : spot.tone === "amber" ? "bg-amber-400" : "bg-cyan-400"
                    }`}
                  />
                </div>

                <div className="bg-[#0b121e]/80 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded text-[11px] font-mono shadow-2xl transition-all duration-300 group-hover:border-cyan-400">
                  <p className="text-white font-bold tracking-wider">{spot.label}</p>
                  <p className="text-slate-400 text-[10px]">{spot.sublabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ----------------- ENTERPRISE HUD OVERLAY LAYER ----------------- */}
      <div className="relative z-40 w-full h-full flex flex-col justify-between p-6 md:p-10 pointer-events-none">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 border border-white/10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs tracking-wider text-slate-300 hover:text-white transition"
            >
              ← HOME
            </Link>
            <div className="border-l border-white/10 pl-4">
              <h1 className="text-sm font-bold tracking-[0.25em] text-cyan-300 font-mono">
                RTC SMART CITY // DIGITAL TWIN
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-0.5">
                SCENE 0{currentScene.id} / 08 • {currentScene.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-black/50 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-lg flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300 text-[11px]">HARDWARE LINK: ACTIVE</span>
              <span className="text-cyan-400 text-[11px] border-l border-white/10 pl-3">DEMO / SIMULATION</span>
            </div>

            <Link
              href="/login"
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold px-4 py-1.5 rounded-lg text-xs transition"
            >
              COMMAND CENTER →
            </Link>
          </div>
        </header>

        {/* Center Dynamic Alert Badge (Scene 4/6 Anomaly specific) */}
        <div className="flex items-center justify-end pointer-events-none pr-4">
          <AnimatePresence>
            {(currentScene.id === 4 || currentScene.id === 6) && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="w-96 bg-[#0c121e]/90 border border-rose-500/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl font-mono pointer-events-auto"
              >
                <div className="flex items-center justify-between border-b border-rose-500/30 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert size={18} />
                    <span className="font-bold text-xs tracking-wider">AI DIAGNOSTIC EXCEPTION</span>
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">CRITICAL</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Anomaly Target:</span>
                    <span className="text-white font-bold">Lateral Pipe Ward 02</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Breach Probability:</span>
                    <span className="text-rose-400 font-bold">89.4% (Acoustic Match)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Normal Expected Flow:</span>
                    <span className="text-slate-300">3.0 L/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Observed Sensor Flow:</span>
                    <span className="text-rose-400 font-bold">5.7 L/min (+90%)</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Auto-containment:</span>
                  <button
                    onClick={() => {
                      setValveOverride(true);
                      transitionToScene(6); // Trigger AI response / safe scene
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded text-xs transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    {valveOverride ? "VALVE V2 ISOLATED" : "EXECUTE SHUTOFF"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Control & Live Telemetry Strip */}
        <footer className="space-y-4 pointer-events-auto">
          {/* Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Droplet size={12} className="text-cyan-400" /> TANK LEVEL
              </p>
              <p className="text-lg font-light text-white mt-1">{currentScene.telemetry.tankLevel}</p>
            </div>

            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Activity size={12} className="text-cyan-400" /> FLOW VELOCITY
              </p>
              <p
                className={`text-lg font-light mt-1 ${
                  currentScene.telemetry.systemState === "CRITICAL" ? "text-rose-400 font-bold" : "text-white"
                }`}
              >
                {currentScene.telemetry.flowRate}
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Zap size={12} className="text-amber-400" /> STREET LIGHTS
              </p>
              <p className="text-lg font-light text-white mt-1">{currentScene.telemetry.lightsActive}</p>
            </div>

            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-3 rounded-xl">
              <p className="text-[10px] text-slate-500">LINE PRESSURE</p>
              <p className="text-lg font-light text-white mt-1">{currentScene.telemetry.pressure}</p>
            </div>

            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-3 rounded-xl">
              <p className="text-[10px] text-slate-500">GRID CONSUMPTION</p>
              <p className="text-lg font-light text-white mt-1">{currentScene.telemetry.gridLoad}</p>
            </div>

            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-3 rounded-xl flex flex-col justify-between">
              <p className="text-[10px] text-slate-500">STATE</p>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold tracking-wider inline-block text-center ${
                  currentScene.telemetry.systemState === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : currentScene.telemetry.systemState === "OPTIMIZED"
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {currentScene.telemetry.systemState}
              </span>
            </div>
          </div>

          {/* Player & Scene Navigation Track */}
          <div className="bg-black/70 border border-white/10 backdrop-blur-xl rounded-2xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={() => transitionToScene(0)}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => transitionToScene(currentSceneIdx + 1)}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 flex-1 max-w-2xl px-4">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => transitionToScene(idx)}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    idx === currentSceneIdx
                      ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                      : idx < currentSceneIdx
                      ? "bg-white/40"
                      : "bg-white/10 hover:bg-white/25"
                  }`}
                  title={`Scene ${scene.id}: ${scene.title}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setInteractiveMode(!interactiveMode)}
                className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition ${
                  interactiveMode
                    ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {interactiveMode ? "PAUSED ON TELEMETRY" : "AUTO-TOUR MODE"}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}