import { motion } from "framer-motion";
import { AlertTriangle, Activity, Droplet, Zap } from "lucide-react";

export default function CinematicUI({ sceneIndex, onStartDemo, anomalyActive }: any) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-12">
      
      {/* Header */}
      <header className="flex justify-between items-center text-white/80">
        <div className="tracking-widest text-sm font-mono border-b border-white/20 pb-1">
          RTC SMART CITY // DIGITAL TWIN
        </div>
        {sceneIndex > 0 && (
          <div className="font-mono text-xs flex gap-4">
            <span className="text-blue-400">DEMO / SIMULATION</span>
            <span>STS: ACTIVE</span>
          </div>
        )}
      </header>

      {/* Center Cinematic Text */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        {sceneIndex === 0 && (
          <motion.div 
            className="text-center pointer-events-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <h1 className="text-6xl font-light text-white tracking-tighter mb-4">
              RTC SMART CITY
            </h1>
            <p className="text-gray-400 font-mono text-sm tracking-widest mb-12">
              IoT • AI • AUTOMATION • DIGITAL TWIN
            </p>
            <button 
              onClick={onStartDemo}
              className="px-8 py-3 bg-white text-black text-sm font-bold tracking-wider hover:bg-gray-200 transition-colors"
            >
              EXPLORE DIGITAL TWIN
            </button>
          </motion.div>
        )}

        {sceneIndex === 1 && <CinematicText text="ONE CITY. ONE DIGITAL TWIN." />}
        {sceneIndex === 2 && <CinematicText text="EVERY LITRE." />}
        {sceneIndex === 3 && <CinematicText text="INTELLIGENT DISTRIBUTION." />}
      </div>

      {/* AI Anomaly Overlay (Scene 5) */}
      {sceneIndex === 5 && (
        <motion.div 
          className="absolute top-1/3 right-24 bg-black/60 border border-red-500/50 backdrop-blur-md p-6 w-80 text-white font-mono"
          variants={containerVariants} initial="hidden" animate="visible"
        >
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <AlertTriangle size={20} />
            <span className="font-bold tracking-wider">ANOMALY DETECTED</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-400">Leak Probability</span>
              <span>87%</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-400">Expected Flow</span>
              <span>3.0 L/min</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-400">Observed Flow</span>
              <span className="text-red-400">5.7 L/min</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-red-500/30 text-xs text-red-400">
            AI RECOMMENDATION: INSPECT VALVE V2
          </div>
        </motion.div>
      )}

      {/* Command Center Dashboard Entry (Scene 9) */}
      {sceneIndex === 9 && (
        <motion.div 
          className="absolute bottom-12 left-12 right-12 grid grid-cols-4 gap-4 pointer-events-auto"
          variants={containerVariants} initial="hidden" animate="visible"
        >
          <DashboardCard title="TANK LEVEL" value="78%" icon={<Droplet />} />
          <DashboardCard title="FLOW RATE" value="8.1 L/min" icon={<Activity />} />
          <DashboardCard title="STREET LIGHTS" value="42/48" icon={<Zap />} />
          <a href="/dashboard" className="flex items-center justify-center bg-blue-600 text-white text-sm font-bold tracking-widest hover:bg-blue-500 transition-colors h-full">
            ENTER COMMAND CENTER →
          </a>
        </motion.div>
      )}
    </div>
  );
}

// Helper Components
const CinematicText = ({ text }: { text: string }) => (
  <motion.h2 
    className="text-4xl font-light text-white tracking-widest"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  >
    {text}
  </motion.h2>
);

const DashboardCard = ({ title, value, icon }: any) => (
  <div className="bg-black/80 border border-white/10 backdrop-blur-md p-6 text-white">
    <div className="flex items-center gap-3 text-gray-400 mb-2 font-mono text-xs tracking-wider">
      {icon} {title}
    </div>
    <div className="text-3xl font-light">{value}</div>
  </div>
);