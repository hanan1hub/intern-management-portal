require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  await pool.query(`
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
  `);
  console.log('Migration complete: deadline column added to tasks table.');
  await pool.end();
}

migrate().catch((err) => { console.error(err.message); process.exit(1); });
