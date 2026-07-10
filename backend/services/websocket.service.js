const { WebSocketServer } = require('ws');
const { pool } = require('../config/db');
const esp32 = require('./esp32.service');

let wss;
const DEVICE_ID = 1; // single-device deployment (see devices table)

function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('[WS] Client connected:', req.socket.remoteAddress);
    ws.send(JSON.stringify({ type: 'connected', message: 'Live feed active' }));

    ws.on('close', () => console.log('[WS] Client disconnected'));
  });

  const interval = Number(process.env.POLL_INTERVAL_MS || 5000);
  setInterval(pollAndBroadcast, interval);
  console.log(`[WS] Polling ESP32 every ${interval}ms`);
}

function broadcast(payload) {
  if (!wss) return;
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(data);
  });
}

async function pollAndBroadcast() {
  try {
    const status = await esp32.getStatus();

    await pool.query(
      `UPDATE devices SET is_online = TRUE, last_seen_at = NOW() WHERE id = ?`,
      [DEVICE_ID]
    );

    await pool.query(
      `INSERT INTO sensor_logs
       (device_id, tank_level_ml, flow_rate_lpm, ward1_ml, ward2_ml, ward3_ml,
        active_ward, street_light, leak_detected, dry_tank)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        DEVICE_ID,
        status.tankLevelMl,
        status.flowRateLpm,
        status.ward1Ml,
        status.ward2Ml,
        status.ward3Ml,
        status.activeWard,
        status.streetLight,
        status.leakDetected,
        status.dryTank,
      ]
    );

    if (status.leakDetected) await raiseAlert('leak', 'critical', 'Leak detected: flow with all valves closed.');
    if (status.dryTank) await raiseAlert('dry_tank', 'critical', 'Tank level critically low (dry-tank condition).');

    broadcast({ type: 'status', data: status });
  } catch (err) {
    await pool.query(`UPDATE devices SET is_online = FALSE WHERE id = ?`, [DEVICE_ID]).catch(() => {});
    broadcast({ type: 'device_offline', message: err.message });
  }
}

async function raiseAlert(alertType, severity, message) {
  const [existing] = await pool.query(
    `SELECT id FROM alerts WHERE device_id=? AND alert_type=? AND is_resolved=FALSE LIMIT 1`,
    [DEVICE_ID, alertType]
  );
  if (existing.length === 0) {
    await pool.query(
      `INSERT INTO alerts (device_id, alert_type, severity, message) VALUES (?,?,?,?)`,
      [DEVICE_ID, alertType, severity, message]
    );
    broadcast({ type: 'alert', alertType, severity, message });
  }
}

module.exports = { initWebSocket, broadcast };
