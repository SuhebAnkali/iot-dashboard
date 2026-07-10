const express = require('express');
const { pool } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const esp32 = require('../services/esp32.service');

const router = express.Router();
const DEVICE_ID = 1;

async function logAction(userId, actionType, targetWard, result, notes = null) {
  await pool.query(
    `INSERT INTO control_actions (device_id, user_id, action_type, target_ward, result, notes)
     VALUES (?,?,?,?,?,?)`,
    [DEVICE_ID, userId, actionType, targetWard, result, notes]
  );
}

// GET /api/device/status  -> live snapshot (User + Operator)
router.get('/status', authenticate, requireRole('user', 'operator'), async (req, res) => {
  try {
    const status = await esp32.getStatus();
    res.json(status);
  } catch (err) {
    // Fall back to the last known DB reading if the ESP32 is unreachable
    const [rows] = await pool.query(
      `SELECT * FROM sensor_logs WHERE device_id=? ORDER BY recorded_at DESC LIMIT 1`,
      [DEVICE_ID]
    );
    if (rows.length) {
      return res.json({ ...rows[0], stale: true, error: 'Device unreachable, showing last known reading.' });
    }
    res.status(503).json({ error: 'Device unreachable and no historical data available.' });
  }
});

// GET /api/device/history?hours=24  -> chart data (User + Operator)
router.get('/history', authenticate, requireRole('user', 'operator'), async (req, res) => {
  const hours = Math.min(Number(req.query.hours) || 24, 168);
  const [rows] = await pool.query(
    `SELECT tank_level_ml, flow_rate_lpm, ward1_ml, ward2_ml, ward3_ml,
            street_light, leak_detected, dry_tank, recorded_at
     FROM sensor_logs
     WHERE device_id = ? AND recorded_at >= NOW() - INTERVAL ? HOUR
     ORDER BY recorded_at ASC`,
    [DEVICE_ID, hours]
  );
  res.json(rows);
});

// GET /api/device/wards  -> ward master + consumption (User + Operator)
router.get('/wards', authenticate, requireRole('user', 'operator'), async (req, res) => {
  const [wards] = await pool.query(`SELECT * FROM wards WHERE device_id = ? ORDER BY ward_number`, [DEVICE_ID]);
  res.json(wards);
});

// GET /api/device/alerts  -> unresolved alerts (User + Operator)
router.get('/alerts', authenticate, requireRole('user', 'operator'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM alerts WHERE device_id = ? ORDER BY created_at DESC LIMIT 50`,
    [DEVICE_ID]
  );
  res.json(rows);
});

// ----------------- OPERATOR-ONLY HARDWARE CONTROL -----------------

// POST /api/device/valve  { ward: 1-3, state: true/false }
router.post('/valve', authenticate, requireRole('operator'), async (req, res) => {
  const { ward, state } = req.body;
  if (![1, 2, 3].includes(Number(ward))) {
    return res.status(400).json({ error: 'ward must be 1, 2, or 3.' });
  }
  try {
    await esp32.setValve(ward, state);
    await logAction(req.user.id, state ? 'valve_open' : 'valve_close', ward, 'success');
    res.json({ success: true, ward, state: Boolean(state) });
  } catch (err) {
    await logAction(req.user.id, state ? 'valve_open' : 'valve_close', ward, 'failed', err.message);
    res.status(502).json({ error: 'Failed to reach ESP32 device.' });
  }
});

// POST /api/device/light  { mode: 'on' | 'off' | 'auto' }
router.post('/light', authenticate, requireRole('operator'), async (req, res) => {
  const { mode } = req.body;
  if (!['on', 'off', 'auto'].includes(mode)) {
    return res.status(400).json({ error: "mode must be 'on', 'off', or 'auto'." });
  }
  try {
    await esp32.setLight(mode);
    await logAction(req.user.id, `light_${mode}`, null, 'success');
    res.json({ success: true, mode });
  } catch (err) {
    await logAction(req.user.id, `light_${mode}`, null, 'failed', err.message);
    res.status(502).json({ error: 'Failed to reach ESP32 device.' });
  }
});

// POST /api/device/refill
router.post('/refill', authenticate, requireRole('operator'), async (req, res) => {
  try {
    await esp32.refillTank();
    await logAction(req.user.id, 'refill', null, 'success');
    res.json({ success: true, message: 'Tank refilled to full capacity.' });
  } catch (err) {
    await logAction(req.user.id, 'refill', null, 'failed', err.message);
    res.status(502).json({ error: 'Failed to reach ESP32 device.' });
  }
});

module.exports = router;
