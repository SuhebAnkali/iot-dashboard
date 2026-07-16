const express = require('express');

const { pool } = require('../config/db');
const {
  authenticate,
  requireRole,
} = require('../middleware/auth');

const esp32 = require('../services/esp32.service');

const {
  logActivity,
  getRequestIp,
} = require('../services/activity.service');

const router = express.Router();

const DEVICE_ID = 1;

/**
 * Prevents rejected async operations from crashing the server.
 */
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

/**
 * Existing control-action audit table.
 */
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

// ------------------------------------------------------------
// Device information
// ------------------------------------------------------------

// GET /api/device/status
// User + Operator
router.get(
  '/status',
  authenticate,
  requireRole('user', 'operator'),
  asyncHandler(async (req, res) => {
    try {
      const status = await esp32.getStatus();

      return res.json({
        ...status,
        deviceOnline: true,
        device_online: true,
        stale: false,
      });
    } catch (err) {
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
          deviceOnline: false,
          device_online: false,
          stale: true,
          error:
            'Device unreachable, showing last known reading.',
        });
      }

      return res.status(503).json({
        deviceOnline: false,
        device_online: false,
        stale: true,
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
        Number.isFinite(requestedHours)
          ? requestedHours
          : 24,
        1
      ),
      720
    );

    const [rows] = await pool.query(
      `SELECT
         tank_level_ml,
         flow_rate_lpm,
         ward1_ml,
         ward2_ml,
         ward3_ml,
         active_ward,
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
       LIMIT 100`,
      [DEVICE_ID]
    );

    return res.json(rows);
  })
);

// GET /api/device/details
// User + Operator
router.get(
  '/details',
  authenticate,
  requireRole('user', 'operator'),
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT
         id,
         name,
         device_type,
         location,
         ip_address,
         firmware_version,
         is_online,
         last_seen_at,
         created_at
       FROM devices
       WHERE id = ?
       LIMIT 1`,
      [DEVICE_ID]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Device record not found.',
      });
    }

    return res.json(rows[0]);
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
    const state = req.body.state;

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
      const response = await esp32.setValve(
        ward,
        state
      );

      await logAction(
        req.user.id,
        actionType,
        ward,
        'success'
      );

      await logActivity({
        user: req.user,
        actionType: state
          ? 'valve_opened'
          : 'valve_closed',
        category: 'water',
        description: `Ward ${ward} valve was ${
          state ? 'opened' : 'closed'
        } manually by ${req.user.name}.`,
        severity: 'success',
        result: 'success',
        targetType: 'ward_valve',
        targetId: ward,
        metadata: {
          ward,
          state,
          esp32Response: response ?? null,
        },
        ipAddress: getRequestIp(req),
      });

      return res.json({
        success: true,
        ward,
        state,
        deviceResponse: response,
      });
    } catch (err) {
      await logAction(
        req.user.id,
        actionType,
        ward,
        'failed',
        err.message
      ).catch((logError) => {
        console.error(
          '[Device] Failed to write control action:',
          logError.message
        );
      });

      await logActivity({
        user: req.user,
        actionType: state
          ? 'valve_open_failed'
          : 'valve_close_failed',
        category: 'water',
        description: `Failed to ${
          state ? 'open' : 'close'
        } Ward ${ward} valve.`,
        severity: 'warning',
        result: 'failed',
        targetType: 'ward_valve',
        targetId: ward,
        metadata: {
          ward,
          state,
          error: err.message,
        },
        ipAddress: getRequestIp(req),
      });

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
    const mode = req.body.mode;

    if (!['on', 'off', 'auto'].includes(mode)) {
      return res.status(400).json({
        error:
          "mode must be 'on', 'off', or 'auto'.",
      });
    }

    const actionType = `light_${mode}`;

    try {
      const response = await esp32.setLight(mode);

      await logAction(
        req.user.id,
        actionType,
        null,
        'success'
      );

      await logActivity({
        user: req.user,
        actionType: `street_light_${mode}`,
        category: 'lighting',
        description:
          `Street-light mode was changed to ${mode.toUpperCase()} by ${req.user.name}.`,
        severity: 'success',
        result: 'success',
        targetType: 'street_light',
        targetId: 'main',
        metadata: {
          mode,
          esp32Response: response ?? null,
        },
        ipAddress: getRequestIp(req),
      });

      return res.json({
        success: true,
        mode,
        deviceResponse: response,
      });
    } catch (err) {
      await logAction(
        req.user.id,
        actionType,
        null,
        'failed',
        err.message
      ).catch((logError) => {
        console.error(
          '[Device] Failed to write control action:',
          logError.message
        );
      });

      await logActivity({
        user: req.user,
        actionType: `street_light_${mode}_failed`,
        category: 'lighting',
        description:
          `Failed to change street-light mode to ${mode.toUpperCase()}.`,
        severity: 'warning',
        result: 'failed',
        targetType: 'street_light',
        targetId: 'main',
        metadata: {
          mode,
          error: err.message,
        },
        ipAddress: getRequestIp(req),
      });

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
      const response =
        await esp32.refillTank();

      await logAction(
        req.user.id,
        'refill',
        null,
        'success'
      );

      await logActivity({
        user: req.user,
        actionType: 'tank_refilled',
        category: 'water',
        description:
          `The main tank quantity was reset to full capacity by ${req.user.name}.`,
        severity: 'success',
        result: 'success',
        targetType: 'tank',
        targetId: 'main',
        metadata: {
          capacityMl: 5000,
          esp32Response: response ?? null,
        },
        ipAddress: getRequestIp(req),
      });

      return res.json({
        success: true,
        message:
          'Tank refilled to full capacity.',
        deviceResponse: response,
      });
    } catch (err) {
      await logAction(
        req.user.id,
        'refill',
        null,
        'failed',
        err.message
      ).catch((logError) => {
        console.error(
          '[Device] Failed to write control action:',
          logError.message
        );
      });

      await logActivity({
        user: req.user,
        actionType: 'tank_refill_failed',
        category: 'water',
        description:
          'Failed to refill the main tank because the ESP32 was unreachable.',
        severity: 'warning',
        result: 'failed',
        targetType: 'tank',
        targetId: 'main',
        metadata: {
          error: err.message,
        },
        ipAddress: getRequestIp(req),
      });

      return res.status(502).json({
        error: 'Failed to reach ESP32 device.',
      });
    }
  })
);

module.exports = router;