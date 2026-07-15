const { WebSocketServer, WebSocket } = require('ws');
const { pool } = require('../config/db');
const esp32 = require('./esp32.service');

const {
  openAlert,
  resolveAlert,
  logResolvedEvent,
} = require('./alert.service');

let wss;
let pollingTimer = null;

const DEVICE_ID = 1;

const POLL_INTERVAL_MS = Number(
  process.env.POLL_INTERVAL_MS || 5000
);

const TANK_CAPACITY_ML = Number(
  process.env.TANK_CAPACITY_ML || 5000
);

const LOW_TANK_THRESHOLD_PERCENT = Number(
  process.env.LOW_TANK_THRESHOLD_PERCENT || 20
);

const LOW_TANK_THRESHOLD_ML =
  (TANK_CAPACITY_ML *
    LOW_TANK_THRESHOLD_PERCENT) /
  100;

/*
 * null  = backend has not checked the ESP32 yet
 * true  = last check succeeded
 * false = last check failed
 */
let previousHardwareOnline = null;

let previousLeakDetected = false;
let previousDryTank = false;
let previousLowTank = false;

function initWebSocket(server) {
  wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  wss.on('connection', (ws, req) => {
    console.log(
      '[WS] Client connected:',
      req.socket.remoteAddress
    );

    ws.send(
      JSON.stringify({
        type: 'connected',
        message: 'Live feed active',
      })
    );

    ws.on('close', () => {
      console.log('[WS] Client disconnected');
    });
  });

  /*
   * Avoid creating multiple polling intervals if this function
   * is accidentally called more than once.
   */
  if (!pollingTimer) {
    pollingTimer = setInterval(
      pollAndBroadcast,
      POLL_INTERVAL_MS
    );

    /*
     * Perform the first hardware check immediately rather than
     * waiting for the first interval.
     */
    pollAndBroadcast().catch((error) => {
      console.error(
        '[WS] Initial ESP32 poll failed:',
        error.message
      );
    });
  }

  console.log(
    `[WS] Polling ESP32 every ${POLL_INTERVAL_MS}ms`
  );
}

function broadcast(payload) {
  if (!wss) return;

  const data = JSON.stringify(payload);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

async function pollAndBroadcast() {
  try {
    const status = await esp32.getStatus();

    const onlineStatus = {
      ...status,
      deviceOnline: true,
      device_online: true,
      stale: false,
    };

    await markDeviceOnline();

    /*
     * If the ESP32 was previously offline, resolve the warning
     * and add an informational recovery event.
     */
    if (previousHardwareOnline === false) {
      const resolution = await resolveAlert(
        'esp32_offline',
        DEVICE_ID
      );

      if (resolution.resolved) {
        const recoveryEvent = await logResolvedEvent(
          'esp32_online',
          'info',
          'ESP32 connection restored. Live sensor data is available.',
          DEVICE_ID
        );

        broadcast({
          type: 'device_online',
          message:
            'ESP32 connection restored. Live sensor data is available.',
          alert: recoveryEvent,
        });
      }
    }

    previousHardwareOnline = true;

    await saveSensorLog(status);

    await evaluateLeakCondition(status);
    await evaluateDryTankCondition(status);
    await evaluateLowTankCondition(status);

    broadcast({
      type: 'status',
      data: onlineStatus,
    });
  } catch (error) {
    await handleEsp32Offline(error);
  }
}

async function markDeviceOnline() {
  await pool.query(
    `UPDATE devices
     SET
       is_online = TRUE,
       last_seen_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [DEVICE_ID]
  );
}

async function markDeviceOffline() {
  await pool.query(
    `UPDATE devices
     SET is_online = FALSE
     WHERE id = ?`,
    [DEVICE_ID]
  );
}

async function saveSensorLog(status) {
  await pool.query(
    `INSERT INTO sensor_logs
      (
        device_id,
        tank_level_ml,
        flow_rate_lpm,
        ward1_ml,
        ward2_ml,
        ward3_ml,
        active_ward,
        street_light,
        leak_detected,
        dry_tank
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
}

async function handleEsp32Offline(error) {
  await markDeviceOffline().catch((databaseError) => {
    console.error(
      '[WS] Failed to update offline device state:',
      databaseError.message
    );
  });

  /*
   * openAlert prevents a new database row from being inserted
   * every five seconds.
   */
  const result = await openAlert(
    'esp32_offline',
    'warning',
    'ESP32 hardware is offline. The dashboard is showing the last known cloud data.',
    DEVICE_ID
  ).catch((databaseError) => {
    console.error(
      '[Alerts] Failed to create ESP32 offline alert:',
      databaseError.message
    );

    return {
      created: false,
      alert: null,
    };
  });

  previousHardwareOnline = false;

  /*
   * Broadcast every poll so new browser sessions know the device
   * is offline. The frontend uses a fixed toast ID, so this will
   * not create repeated popup stacks.
   */
  broadcast({
    type: 'device_offline',
    severity: 'warning',
    message:
      'ESP32 hardware is offline. Showing last known cloud data.',
    deviceOnline: false,
    error: error.message,
    alert: result.alert,
  });

  /*
   * Send an alert frame only when a new database alert was
   * actually created.
   */
  if (result.created) {
    broadcast({
      type: 'alert',
      alertType: 'esp32_offline',
      severity: 'warning',
      message:
        'ESP32 hardware is offline. The dashboard is showing the last known cloud data.',
      alert: result.alert,
    });
  }
}

async function evaluateLeakCondition(status) {
  const detected = status.leakDetected === true;

  if (detected) {
    const result = await openAlert(
      'leak_detected',
      'critical',
      'Leak detected: water flow was measured while all ward valves should be closed.',
      DEVICE_ID
    );

    if (result.created) {
      broadcast({
        type: 'alert',
        alertType: 'leak_detected',
        severity: 'critical',
        message:
          'Leak detected: water flow was measured while all ward valves should be closed.',
        alert: result.alert,
      });
    }
  } else if (previousLeakDetected) {
    const result = await resolveAlert(
      'leak_detected',
      DEVICE_ID
    );

    if (result.resolved) {
      const event = await logResolvedEvent(
        'leak_cleared',
        'info',
        'Leak condition cleared. Water flow has returned to normal.',
        DEVICE_ID
      );

      broadcast({
        type: 'alert_resolved',
        alertType: 'leak_detected',
        message: 'Leak condition cleared.',
        alert: event,
      });
    }
  }

  previousLeakDetected = detected;
}

async function evaluateDryTankCondition(status) {
  const detected = status.dryTank === true;

  if (detected) {
    const result = await openAlert(
      'dry_tank',
      'critical',
      'Dry-tank condition detected. Water distribution must remain stopped to protect the system.',
      DEVICE_ID
    );

    if (result.created) {
      broadcast({
        type: 'alert',
        alertType: 'dry_tank',
        severity: 'critical',
        message:
          'Dry-tank condition detected. Water distribution must remain stopped.',
        alert: result.alert,
      });
    }
  } else if (previousDryTank) {
    const result = await resolveAlert(
      'dry_tank',
      DEVICE_ID
    );

    if (result.resolved) {
      const event = await logResolvedEvent(
        'dry_tank_cleared',
        'info',
        'Dry-tank condition cleared. Tank level has returned to a safe range.',
        DEVICE_ID
      );

      broadcast({
        type: 'alert_resolved',
        alertType: 'dry_tank',
        message: 'Dry-tank condition cleared.',
        alert: event,
      });
    }
  }

  previousDryTank = detected;
}

async function evaluateLowTankCondition(status) {
  const tankLevelMl = Number(status.tankLevelMl || 0);

  /*
   * Dry tank is already a critical alert, so do not also create
   * a separate low-tank warning during a dry-tank condition.
   */
  const lowTank =
    status.dryTank !== true &&
    tankLevelMl > 0 &&
    tankLevelMl <= LOW_TANK_THRESHOLD_ML;

  if (lowTank) {
    const result = await openAlert(
      'low_tank',
      'warning',
      `Tank level is below ${LOW_TANK_THRESHOLD_PERCENT}% (${Math.round(
        LOW_TANK_THRESHOLD_ML
      )} mL).`,
      DEVICE_ID
    );

    if (result.created) {
      broadcast({
        type: 'alert',
        alertType: 'low_tank',
        severity: 'warning',
        message:
          `Tank level is below ${LOW_TANK_THRESHOLD_PERCENT}%.`,
        alert: result.alert,
      });
    }
  } else if (previousLowTank) {
    const result = await resolveAlert(
      'low_tank',
      DEVICE_ID
    );

    if (result.resolved) {
      const event = await logResolvedEvent(
        'tank_level_normal',
        'info',
        'Tank level returned above the low-level warning threshold.',
        DEVICE_ID
      );

      broadcast({
        type: 'alert_resolved',
        alertType: 'low_tank',
        message:
          'Tank level returned to the normal range.',
        alert: event,
      });
    }
  }

  previousLowTank = lowTank;
}

module.exports = {
  initWebSocket,
  broadcast,
};