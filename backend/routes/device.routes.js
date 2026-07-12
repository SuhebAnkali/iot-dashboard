const express = require('express');
const { pool } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const esp32 = require('../services/esp32.service');

const router = express.Router();
const DEVICE_ID = 1;

/**
 * Prevents rejected async operations from crashing the Node.js server.
 */
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

async function logAction(
  userId,
  actionType,
  targetWard,
  result,
  notes = null
) {
  await pool.query(
    `INSERT INTO control_actions
      (
        device_id,
        user_id,
        action_type,
        target_ward,
        result,
        notes
      )
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      DEVICE_ID,
      userId,
      actionType,
      targetWard,
      result,
      notes,
    ]
  );
}

// GET /api/device/status
// User + Operator
router.get(
  '/status',
  authenticate,
  requireRole('user', 'operator'),
  asyncHandler(async (req, res) => {
    try {
      const status = await esp32.getStatus();
      return res.json(status);
    } catch (err) {
      // Use the latest database record while the ESP32 is offline.
      const [rows] = await pool.query(
        `SELECT *
         FROM sensor_logs
         WHERE device_id = ?
         ORDER BY recorded_at DESC
         LIMIT 1`,
        [DEVICE_ID]
      );

      if (rows.length > 0) {
        return res.json({
          ...rows[0],
          stale: true,
          error:
            'Device unreachable, showing last known reading.',
        });
      }

      return res.status(503).json({
        error:
          'Device unreachable and no historical data is available.',
      });
    }
  })
);

// GET /api/device/history?hours=24
// User + Operator
router.get(
  '/history',
  authenticate,
  requireRole('user', 'operator'),
  asyncHandler(async (req, res) => {
    const requestedHours = Number(req.query.hours);
    const hours = Math.min(
      Math.max(
        Number.isFinite(requestedHours) ? requestedHours : 24,
        1
      ),
      168
    );

    const [rows] = await pool.query(
      `SELECT
         tank_level_ml,
         flow_rate_lpm,
         ward1_ml,
         ward2_ml,
         ward3_ml,
         street_light,
         leak_detected,
         dry_tank,
         recorded_at
       FROM sensor_logs
       WHERE device_id = ?
         AND recorded_at >=
             CURRENT_TIMESTAMP - (? * INTERVAL '1 hour')
       ORDER BY recorded_at ASC`,
      [DEVICE_ID, hours]
    );

    return res.json(rows);
  })
);

// GET /api/device/wards
// User + Operator
router.get(
  '/wards',
  authenticate,
  requireRole('user', 'operator'),
  asyncHandler(async (req, res) => {
    const [wards] = await pool.query(
      `SELECT *
       FROM wards
       WHERE device_id = ?
       ORDER BY ward_number`,
      [DEVICE_ID]
    );

    return res.json(wards);
  })
);

// GET /api/device/alerts
// User + Operator
router.get(
  '/alerts',
  authenticate,
  requireRole('user', 'operator'),
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT *
       FROM alerts
       WHERE device_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [DEVICE_ID]
    );

    return res.json(rows);
  })
);

// ------------------------------------------------------------
// Operator-only hardware controls
// ------------------------------------------------------------

// POST /api/device/valve
// Body: { ward: 1-3, state: true/false }
router.post(
  '/valve',
  authenticate,
  requireRole('operator'),
  asyncHandler(async (req, res) => {
    const ward = Number(req.body.ward);
    const { state } = req.body;

    if (![1, 2, 3].includes(ward)) {
      return res.status(400).json({
        error: 'ward must be 1, 2, or 3.',
      });
    }

    if (typeof state !== 'boolean') {
      return res.status(400).json({
        error: 'state must be true or false.',
      });
    }

    const actionType = state
      ? 'valve_open'
      : 'valve_close';

    try {
      await esp32.setValve(ward, state);

      await logAction(
        req.user.id,
        actionType,
        ward,
        'success'
      );

      return res.json({
        success: true,
        ward,
        state,
      });
    } catch (err) {
      await logAction(
        req.user.id,
        actionType,
        ward,
        'failed',
        err.message
      );

      return res.status(502).json({
        error: 'Failed to reach ESP32 device.',
      });
    }
  })
);

// POST /api/device/light
// Body: { mode: 'on' | 'off' | 'auto' }
router.post(
  '/light',
  authenticate,
  requireRole('operator'),
  asyncHandler(async (req, res) => {
    const { mode } = req.body;

    if (!['on', 'off', 'auto'].includes(mode)) {
      return res.status(400).json({
        error: "mode must be 'on', 'off', or 'auto'.",
      });
    }

    const actionType = `light_${mode}`;

    try {
      await esp32.setLight(mode);

      await logAction(
        req.user.id,
        actionType,
        null,
        'success'
      );

      return res.json({
        success: true,
        mode,
      });
    } catch (err) {
      await logAction(
        req.user.id,
        actionType,
        null,
        'failed',
        err.message
      );

      return res.status(502).json({
        error: 'Failed to reach ESP32 device.',
      });
    }
  })
);

// POST /api/device/refill
router.post(
  '/refill',
  authenticate,
  requireRole('operator'),
  asyncHandler(async (req, res) => {
    try {
      await esp32.refillTank();

      await logAction(
        req.user.id,
        'refill',
        null,
        'success'
      );

      return res.json({
        success: true,
        message: 'Tank refilled to full capacity.',
      });
    } catch (err) {
      await logAction(
        req.user.id,
        'refill',
        null,
        'failed',
        err.message
      );

      return res.status(502).json({
        error: 'Failed to reach ESP32 device.',
      });
    }
  })
);

module.exports = router;