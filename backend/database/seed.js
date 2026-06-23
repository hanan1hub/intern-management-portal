require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const hash = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT INTO admins (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING`,
    ['admin', hash]
  );
  console.log('Admin seeded successfully.');
  console.log('  Username : admin');
  console.log('  Password : admin123');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
