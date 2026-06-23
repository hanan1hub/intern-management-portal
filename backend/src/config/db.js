const { Pool, types } = require('@neondatabase/serverless');

// Return DATE columns as plain "YYYY-MM-DD" strings instead of Date objects
// so timezone offsets never shift the day value in JSON responses.
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

module.exports = pool;
