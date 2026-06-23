const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const { intern_id, date } = req.query;
    let query = `
      SELECT a.*, i.name AS intern_name, i.department
      FROM attendance a
      JOIN interns i ON a.intern_id = i.id
      WHERE 1=1`;
    const params = [];

    if (intern_id) {
      params.push(intern_id);
      query += ` AND a.intern_id = $${params.length}`;
    }
    if (date) {
      params.push(date);
      query += ` AND a.date = $${params.length}`;
    }
    query += ' ORDER BY a.date DESC, i.name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.mark = async (req, res, next) => {
  try {
    const { intern_id, date, status, notes } = req.body;
    const intern = await pool.query('SELECT id FROM interns WHERE id = $1', [intern_id]);
    if (!intern.rows[0]) return res.status(404).json({ message: 'Intern not found' });

    const result = await pool.query(
      `INSERT INTO attendance (intern_id, date, status, notes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (intern_id, date)
       DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes
       RETURNING *`,
      [intern_id, date, status, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
