require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  await pool.query(`
    ALTER TABLE interns
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
  `);
  await pool.query(`
    ALTER TABLE tasks
      ADD COLUMN IF NOT EXISTS submission_note TEXT,
      ADD COLUMN IF NOT EXISTS submitted_at    TIMESTAMPTZ;
  `);
  console.log('Migration 2 complete: intern password_hash, task submission columns added.');
  await pool.end();
}

migrate().catch((err) => { console.error(err.message); process.exit(1); });
