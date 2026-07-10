const express = require('express');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { pool } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const DEVICE_ID = 1;

async function fetchLogs(hours) {
  const [rows] = await pool.query(
    `SELECT tank_level_ml, flow_rate_lpm, ward1_ml, ward2_ml, ward3_ml,
            street_light, leak_detected, dry_tank, recorded_at
     FROM sensor_logs
     WHERE device_id = ? AND recorded_at >= NOW() - INTERVAL ? HOUR
     ORDER BY recorded_at ASC`,
    [DEVICE_ID, hours]
  );
  return rows;
}

// GET /api/export/pdf?hours=24  (User + Operator can export their own view)
router.get('/pdf', authenticate, requireRole('user', 'operator'), async (req, res) => {
  const hours = Math.min(Number(req.query.hours) || 24, 168);
  const rows = await fetchLogs(hours);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="water_report_${Date.now()}.pdf"`);

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(res);

  doc.fontSize(18).text('Water Distribution & Street Lighting Report', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#555').text(
    `Generated ${new Date().toLocaleString()}  |  Range: last ${hours}h  |  Requested by: ${req.user.name} (${req.user.role})`,
    { align: 'center' }
  );
  doc.moveDown(1);
  doc.fillColor('#000');

  const colX = [40, 150, 230, 290, 350, 410, 470];
  const headers = ['Time', 'Tank(mL)', 'Flow(L/m)', 'W1(mL)', 'W2(mL)', 'W3(mL)', 'Light'];
  doc.fontSize(9).font('Helvetica-Bold');
  headers.forEach((h, i) => doc.text(h, colX[i], doc.y, { continued: i < headers.length - 1 }));
  doc.moveDown(0.5);
  doc.font('Helvetica');

  rows.slice(0, 500).forEach((r) => {
    const y = doc.y;
    doc.fontSize(8);
    doc.text(new Date(r.recorded_at).toLocaleString(), colX[0], y, { width: 105 });
    doc.text(String(r.tank_level_ml), colX[1], y, { width: 75 });
    doc.text(String(r.flow_rate_lpm), colX[2], y, { width: 55 });
    doc.text(String(r.ward1_ml), colX[3], y, { width: 55 });
    doc.text(String(r.ward2_ml), colX[4], y, { width: 55 });
    doc.text(String(r.ward3_ml), colX[5], y, { width: 55 });
    doc.text(r.street_light ? 'ON' : 'OFF', colX[6], y, { width: 40 });
    doc.moveDown(0.6);
    if (doc.y > 760) doc.addPage();
  });

  doc.end();
});

// GET /api/export/excel?hours=24
router.get('/excel', authenticate, requireRole('user', 'operator'), async (req, res) => {
  const hours = Math.min(Number(req.query.hours) || 24, 168);
  const rows = await fetchLogs(hours);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Water IoT Dashboard';
  const sheet = workbook.addWorksheet('Sensor Log');

  sheet.columns = [
    { header: 'Recorded At', key: 'recorded_at', width: 22 },
    { header: 'Tank Level (mL)', key: 'tank_level_ml', width: 16 },
    { header: 'Flow Rate (L/min)', key: 'flow_rate_lpm', width: 16 },
    { header: 'Ward 1 (mL)', key: 'ward1_ml', width: 14 },
    { header: 'Ward 2 (mL)', key: 'ward2_ml', width: 14 },
    { header: 'Ward 3 (mL)', key: 'ward3_ml', width: 14 },
    { header: 'Street Light', key: 'street_light', width: 12 },
    { header: 'Leak Detected', key: 'leak_detected', width: 14 },
    { header: 'Dry Tank', key: 'dry_tank', width: 12 },
  ];
  sheet.getRow(1).font = { bold: true };

  rows.forEach((r) =>
    sheet.addRow({
      ...r,
      street_light: r.street_light ? 'ON' : 'OFF',
      leak_detected: r.leak_detected ? 'YES' : 'NO',
      dry_tank: r.dry_tank ? 'YES' : 'NO',
    })
  );

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="water_report_${Date.now()}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
