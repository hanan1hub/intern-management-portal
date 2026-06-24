require('dotenv').config();
const pool = require('../src/config/db');

(async () => {
  await pool.query(`
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_file_path     VARCHAR(500);
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_file_original VARCHAR(500);
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_file_mime     VARCHAR(100);
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_file_size     INTEGER;
  `);
  console.log('Migration 4 complete — added file columns to tasks');
  process.exit(0);
})().catch((err) => { console.error(err.message); process.exit(1); });
