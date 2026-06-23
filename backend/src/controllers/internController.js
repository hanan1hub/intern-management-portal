const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    let query = 'SELECT * FROM interns WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    if (department) {
      params.push(department);
      query += ` AND department = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM interns WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, department, joining_date } = req.body;
    const existing = await pool.query('SELECT id FROM interns WHERE email = $1', [email]);
    if (existing.rows[0]) {
      return res.status(409).json({ message: 'An intern with this email already exists' });
    }
    const result = await pool.query(
      'INSERT INTO interns (name, email, department, joining_date) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, department, joining_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email, department, joining_date } = req.body;
    if (email) {
      const existing = await pool.query(
        'SELECT id FROM interns WHERE email = $1 AND id != $2',
        [email, req.params.id]
      );
      if (existing.rows[0]) {
        return res.status(409).json({ message: 'An intern with this email already exists' });
      }
    }
    const result = await pool.query(
      `UPDATE interns
       SET name         = COALESCE($1, name),
           email        = COALESCE($2, email),
           department   = COALESCE($3, department),
           joining_date = COALESCE($4, joining_date)
       WHERE id = $5 RETURNING *`,
      [name, email, department, joining_date, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM interns WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json({ message: 'Intern deleted successfully' });
  } catch (err) {
    next(err);
  }
};
