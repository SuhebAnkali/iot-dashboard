// components/digital-twin/cinematicData.ts

export interface SceneConfig {
  id: number;
  title: string;
  subtitle: string;
  videoSrc: string;
  durationEstimate: number; // in seconds
  telemetry: {
    tankLevel: string;
    flowRate: string;
    lightsActive: string;
    gridLoad: string;
    pressure: string;
    systemState: "NOMINAL" | "WARNING" | "CRITICAL" | "OPTIMIZED";
  };
  hudCallouts?: {
    label: string;
    sublabel: string;
    x: string; // CSS percentage position
    y: string;
    tone: "cyan" | "emerald" | "amber" | "rose";
  }[];
}

export const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "METROPOLITAN ESTABLISHING",
    subtitle: "Dusk aerial digital twin calibration",
    videoSrc: "/videos/city-overview.mp4",
    durationEstimate: 6,
    telemetry: {
      tankLevel: "78.4%",
      flowRate: "8.1 L/min",
      lightsActive: "0 / 48 (Standby)",
      gridLoad: "124 kW",
      pressure: "4.2 BAR",
      systemState: "NOMINAL",
    },
    hudCallouts: [
      { label: "PRIMARY SECTOR", sublabel: "RTC GRID 01", x: "28%", y: "42%", tone: "cyan" },
      { label: "ELEVATION NODE", sublabel: "ALT 142m", x: "68%", y: "30%", tone: "cyan" },
    ],
  },
  {
    id: 2,
    title: "WATER INTELLIGENCE",
    subtitle: "Push-in vector: Reservoir, booster station & trunk mains",
    videoSrc: "/videos/water-intelligence.mp4",
    durationEstimate: 5,
    telemetry: {
      tankLevel: "78.0%",
      flowRate: "8.2 L/min",
      lightsActive: "0 / 48",
      gridLoad: "148 kW",
      pressure: "4.8 BAR",
      systemState: "NOMINAL",
    },
    hudCallouts: [
      { label: "TANK T-01", sublabel: "CAP: 1.2M LITRES", x: "62%", y: "24%", tone: "cyan" },
      { label: "PUMP PS-01", sublabel: "TWIN RPM 2900", x: "38%", y: "65%", tone: "emerald" },
    ],
  },
  {
    id: 3,
    title: "WARD DISTRIBUTION DYNAMICS",
    subtitle: "Lateral branch inspection: Ward 01 • Ward 02 • Ward 03",
    videoSrc: "/videos/ward-distribution.mp4",
    durationEstimate: 6,
    telemetry: {
      tankLevel: "77.6%",
      flowRate: "3.0 L/min (Ward avg)",
      lightsActive: "0 / 48",
      gridLoad: "152 kW",
      pressure: "4.1 BAR",
      systemState: "NOMINAL",
    },
    hudCallouts: [
      { label: "WARD 01", sublabel: "FLOW: 2.8 L/min", x: "20%", y: "48%", tone: "emerald" },
      { label: "WARD 02", sublabel: "FLOW: 3.0 L/min", x: "50%", y: "42%", tone: "emerald" },
      { label: "WARD 03", sublabel: "FLOW: 2.9 L/min", x: "80%", y: "52%", tone: "emerald" },
    ],
  },
  {
    id: 4,
    title: "SUBSURFACE ANOMALY",
    subtitle: "Acoustic sensor trip: Pressure drop on lateral branch B-12",
    videoSrc: "/videos/anomaly-detection.mp4",
    durationEstimate: 6,
    telemetry: {
      tankLevel: "76.8%",
      flowRate: "5.7 L/min (DRIFT)",
      lightsActive: "0 / 48",
      gridLoad: "185 kW",
      pressure: "2.1 BAR (DROP)",
      systemState: "CRITICAL",
    },
    hudCallouts: [
      { label: "BREACH DETECTED", sublabel: "PIPE SECTOR W-02", x: "46%", y: "48%", tone: "rose" },
      { label: "DELTA FLOW", sublabel: "+2.7 L/min EXCESS", x: "64%", y: "38%", tone: "rose" },
    ],
  },
  {
    id: 5,
    title: "ADAPTIVE STREET LIGHTING",
    subtitle: "LDR twilight trigger: Arterial luminaires ramping 2700K",
    videoSrc: "/videos/adaptive-lighting.mp4",
    durationEstimate: 6,
    telemetry: {
      tankLevel: "76.4%",
      flowRate: "3.1 L/min",
      lightsActive: "42 / 48 ACTIVE",
      gridLoad: "92 kW (SAVING)",
      pressure: "4.0 BAR",
      systemState: "OPTIMIZED",
    },
    hudCallouts: [
      { label: "CORRIDOR L-01", sublabel: "PWM 100% AMBER", x: "32%", y: "60%", tone: "amber" },
      { label: "CORRIDOR L-02", sublabel: "PWM 80% ECO", x: "68%", y: "55%", tone: "amber" },
    ],
  },
  {
    id: 6,
    title: "AI INTELLIGENCE & INFERENCE",
    subtitle: "Predictive leak modeling & automated valve closure queue",
    videoSrc: "/videos/ai-intelligence.mp4",
    durationEstimate: 6,
    telemetry: {
      tankLevel: "76.1%",
      flowRate: "1.2 L/min (THROTTLED)",
      lightsActive: "42 / 48",
      gridLoad: "95 kW",
      pressure: "3.8 BAR",
      systemState: "WARNING",
    },
    hudCallouts: [
      { label: "NEURAL INFERENCE", sublabel: "CONFIDENCE: 94.2%", x: "45%", y: "32%", tone: "cyan" },
      { label: "VALVE V-02", sublabel: "ACTUATING: 0% SHUT", x: "55%", y: "62%", tone: "rose" },
    ],
  },
  {
    id: 7,
    title: "DIGITAL TWIN MULTI-MODE",
    subtitle: "Layer transition: Structural $\\to$ Hydraulic $\\to$ Electrical",
    videoSrc: "/videos/digital-twin-modes.mp4",
    durationEstimate: 5,
    telemetry: {
      tankLevel: "75.9%",
      flowRate: "0.0 L/min (CONTAINED)",
      lightsActive: "42 / 48",
      gridLoad: "88 kW",
      pressure: "4.2 BAR",
      systemState: "OPTIMIZED",
    },
    hudCallouts: [
      { label: "TWIN LAYER", sublabel: "MULTI-SPECTRAL", x: "50%", y: "50%", tone: "cyan" },
    ],
  },
  {
    id: 8,
    title: "SYSTEM RESTORATION HERO",
    subtitle: "Full night pull-back: Citywide cohesive digital twin state",
    videoSrc: "/videos/final-hero.mp4",
    durationEstimate: 6,
    telemetry: {
      tankLevel: "75.8%",
      flowRate: "3.0 L/min (NOMINAL)",
      lightsActive: "42 / 48 (18.4% SAVED)",
      gridLoad: "84 kW",
      pressure: "4.2 BAR",
      systemState: "NOMINAL",
    },
    hudCallouts: [
      { label: "INCIDENT CONTAINED", sublabel: "SECTOR RESTORED", x: "50%", y: "40%", tone: "emerald" },
    ],
  },
];