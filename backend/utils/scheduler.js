const cron = require('node-cron');
const { pool } = require('../config/db');
const esp32 = require('../services/esp32.service');

const DEVICE_ID = 1;
const DAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Runs every minute: checks active schedules and opens/closes ward valves
 * to match the operator-configured distribution windows.
 */
function startScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const today = DAY_CODES[now.getDay()];
      const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"

      const [schedules] = await pool.query(
        `SELECT * FROM schedules WHERE device_id = ? AND is_active = TRUE`,
        [DEVICE_ID]
      );

      for (const s of schedules) {
        const days = s.days_mask.split(',');
        if (!days.includes(today)) continue;

        const start = s.start_time.slice(0, 5);
        const end = s.end_time.slice(0, 5);
        const shouldBeOpen = hhmm >= start && hhmm < end;

        // Only acts at the exact boundary minute to avoid spamming the ESP32
        if (hhmm === start) {
          await esp32.setValve(s.ward_number, true).catch(() => {});
          console.log(`[Scheduler] Opened ward ${s.ward_number} (scheduled ${start}-${end})`);
        }
        if (hhmm === end) {
          await esp32.setValve(s.ward_number, false).catch(() => {});
          console.log(`[Scheduler] Closed ward ${s.ward_number} (scheduled ${start}-${end})`);
        }
      }
    } catch (err) {
      console.error('[Scheduler] Error evaluating schedules:', err.message);
    }
  });
  console.log('[Scheduler] Water distribution scheduler started (checks every minute).');
}

module.exports = { startScheduler };
