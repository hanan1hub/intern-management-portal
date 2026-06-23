require('dotenv').config();
const pool = require('../src/config/db');

(async () => {
  await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS email VARCHAR(150) UNIQUE`);
  console.log('Migration 3 complete — added email column to admins');
  process.exit(0);
})().catch((err) => { console.error(err.message); process.exit(1); });
