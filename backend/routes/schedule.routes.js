const express = require('express');
const { pool } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const DEVICE_ID = 1;

// GET /api/schedule  -> list all schedules (User + Operator, read-only for User)
router.get('/', authenticate, requireRole('user', 'operator'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.*, u.name AS created_by_name FROM schedules s
     JOIN users u ON u.id = s.created_by
     WHERE s.device_id = ? ORDER BY s.start_time`,
    [DEVICE_ID]
  );
  res.json(rows);
});

// POST /api/schedule  -> create (Operator only)
router.post('/', authenticate, requireRole('operator'), async (req, res) => {
  const { wardNumber, startTime, endTime, daysMask, quotaMl } = req.body;
  if (![1, 2, 3].includes(Number(wardNumber)) || !startTime || !endTime) {
    return res.status(400).json({ error: 'wardNumber (1-3), startTime, and endTime are required.' });
  }
  const [result] = await pool.query(
    `INSERT INTO schedules (device_id, ward_number, start_time, end_time, days_mask, quota_ml, created_by)
     VALUES (?,?,?,?,?,?,?)`,
    [DEVICE_ID, wardNumber, startTime, endTime, daysMask || 'MON,TUE,WED,THU,FRI,SAT,SUN', quotaMl || 1500, req.user.id]
  );
  res.status(201).json({ id: result.insertId });
});

// PATCH /api/schedule/:id  -> update/toggle (Operator only)
router.patch('/:id', authenticate, requireRole('operator'), async (req, res) => {
  const { startTime, endTime, daysMask, quotaMl, isActive } = req.body;
  const fields = [];
  const values = [];
  if (startTime) { fields.push('start_time = ?'); values.push(startTime); }
  if (endTime) { fields.push('end_time = ?'); values.push(endTime); }
  if (daysMask) { fields.push('days_mask = ?'); values.push(daysMask); }
  if (quotaMl !== undefined) { fields.push('quota_ml = ?'); values.push(quotaMl); }
  if (isActive !== undefined) { fields.push('is_active = ?'); values.push(Boolean(isActive)); }
  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update.' });

  values.push(req.params.id, DEVICE_ID);
  await pool.query(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ? AND device_id = ?`, values);
  res.json({ success: true });
});

// DELETE /api/schedule/:id  -> (Operator only)
router.delete('/:id', authenticate, requireRole('operator'), async (req, res) => {
  await pool.query(`DELETE FROM schedules WHERE id = ? AND device_id = ?`, [req.params.id, DEVICE_ID]);
  res.json({ success: true });
});

module.exports = router;
