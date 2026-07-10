require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/db');
const { initWebSocket } = require('./services/websocket.service');
const { startScheduler } = require('./utils/scheduler');

const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const exportRoutes = require('./routes/export.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Basic rate limiting to protect the ESP32-facing control endpoints
const controlLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use('/api/device', controlLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/export', exportRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

const server = http.createServer(app);
initWebSocket(server);

const PORT = process.env.PORT || 5000;

(async () => {
  await testConnection();
  startScheduler();
  server.listen(PORT, () => {
    console.log(`[Server] REST API running on http://localhost:${PORT}`);
    console.log(`[Server] WebSocket live feed on ws://localhost:${PORT}/ws`);
  });
})();
