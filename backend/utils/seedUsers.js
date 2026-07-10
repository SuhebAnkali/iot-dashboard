require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function seed() {
  const operatorEmail = process.env.SEED_OPERATOR_EMAIL || 'operator@iot.local';
  const operatorPassword = process.env.SEED_OPERATOR_PASSWORD || 'Operator@123';
  const userEmail = process.env.SEED_USER_EMAIL || 'viewer@iot.local';
  const userPassword = process.env.SEED_USER_PASSWORD || 'Viewer@123';

  const operatorHash = await bcrypt.hash(operatorPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,'operator')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    ['System Operator', operatorEmail, operatorHash]
  );

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,'user')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    ['Read-Only Viewer', userEmail, userHash]
  );

  console.log('Seed complete:');
  console.log(`  Operator -> ${operatorEmail} / ${operatorPassword}`);
  console.log(`  Viewer   -> ${userEmail} / ${userPassword}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
