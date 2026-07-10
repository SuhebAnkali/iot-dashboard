/**
 * Thin client for the ESP32's on-board REST API.
 * Endpoints exposed by the firmware (see project README):
 *   GET /status                  -> JSON telemetry
 *   GET /valve?w=1&state=1       -> open/close a ward valve
 *   GET /light?state=1|0|auto    -> street light control
 *   GET /refill                  -> reset tank to full capacity
 */

const ESP32_BASE = () => `http://${process.env.ESP32_IP || '192.168.1.50'}`;
const TIMEOUT_MS = Number(process.env.ESP32_TIMEOUT_MS || 3000);

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`ESP32 responded with HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Normalizes raw ESP32 telemetry into the shape the dashboard expects. */
function normalizeStatus(raw) {
  return {
    tankLevelMl: Number(raw.tank ?? raw.tankLevel ?? 0),
    flowRateLpm: Number(raw.flow ?? 0),
    ward1Ml: Number(raw.w1 ?? 0),
    ward2Ml: Number(raw.w2 ?? 0),
    ward3Ml: Number(raw.w3 ?? 0),
    activeWard: Number(raw.ward ?? 0),
    streetLight: Boolean(raw.light),
    leakDetected: Boolean(raw.leak),
    dryTank: Boolean(raw.dry),
    timestamp: new Date().toISOString(),
  };
}

async function getStatus() {
  const raw = await fetchWithTimeout(`${ESP32_BASE()}/status`);
  return normalizeStatus(raw);
}

async function setValve(wardNumber, state) {
  const url = `${ESP32_BASE()}/valve?w=${wardNumber}&state=${state ? 1 : 0}`;
  return fetchWithTimeout(url);
}

async function setLight(mode) {
  // mode: 'on' | 'off' | 'auto'
  const stateParam = mode === 'on' ? '1' : mode === 'off' ? '0' : 'auto';
  const url = `${ESP32_BASE()}/light?state=${stateParam}`;
  return fetchWithTimeout(url);
}

async function refillTank() {
  const url = `${ESP32_BASE()}/refill`;
  return fetchWithTimeout(url);
}

module.exports = { getStatus, setValve, setLight, refillTank, normalizeStatus };
