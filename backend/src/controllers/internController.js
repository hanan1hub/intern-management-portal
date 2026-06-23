const bcrypt = require('bcryptjs');
const pool   = require('../config/db');
const { sendInternCredentials } = require('../services/emailService');

function generatePassword(name) {
  const first  = name.trim().split(' ')[0];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${first}@${digits}`;
}

exports.getAll = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    let query  = 'SELECT id, name, email, department, joining_date, created_at FROM interns WHERE 1=1';
    const params = [];
    if (search)     { params.push(`%${search}%`); query += ` AND name ILIKE $${params.length}`; }
    if (department) { params.push(department);    query += ` AND department = $${params.length}`; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, department, joining_date, created_at FROM interns WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, department, joining_date } = req.body;
    const existing = await pool.query('SELECT id FROM interns WHERE email = $1', [email]);
    if (existing.rows[0]) {
      return res.status(409).json({ message: 'An intern with this email already exists' });
    }

    const plainPassword = generatePassword(name);
    const password_hash = await bcrypt.hash(plainPassword, 10);

    const result = await pool.query(
      `INSERT INTO interns (name, email, department, joining_date, password_hash)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, name, email, department, joining_date, created_at`,
      [name, email, department, joining_date, password_hash]
    );

    // Send credentials email (non-blocking — don't fail the request if email fails)
    sendInternCredentials({ name, email, password: plainPassword }).catch((err) =>
      console.error('Email send failed:', err.message)
    );

    // Return the plain password once so admin can share it as backup
    res.status(201).json({ ...result.rows[0], generatedPassword: plainPassword });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email, department, joining_date } = req.body;
    if (email) {
      const dup = await pool.query(
        'SELECT id FROM interns WHERE email = $1 AND id != $2',
        [email, req.params.id]
      );
      if (dup.rows[0]) return res.status(409).json({ message: 'Email already in use by another intern' });
    }
    const result = await pool.query(
      `UPDATE interns
       SET name         = COALESCE($1, name),
           email        = COALESCE($2, email),
           department   = COALESCE($3, department),
           joining_date = COALESCE($4, joining_date)
       WHERE id = $5
       RETURNING id, name, email, department, joining_date, created_at`,
      [name, email, department, joining_date, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM interns WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json({ message: 'Intern deleted successfully' });
  } catch (err) { next(err); }
};
