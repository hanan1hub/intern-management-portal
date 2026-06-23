const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const { intern_id, status } = req.query;
    let query = `
      SELECT t.*, i.name AS intern_name, i.department
      FROM tasks t
      JOIN interns i ON t.intern_id = i.id
      WHERE 1=1`;
    const params = [];

    if (intern_id) {
      params.push(intern_id);
      query += ` AND t.intern_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }
    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { intern_id, title, description, deadline } = req.body;
    const intern = await pool.query('SELECT id FROM interns WHERE id = $1', [intern_id]);
    if (!intern.rows[0]) return res.status(404).json({ message: 'Intern not found' });

    const result = await pool.query(
      'INSERT INTO tasks (intern_id, title, description, deadline) VALUES ($1,$2,$3,$4) RETURNING *',
      [intern_id, title, description || null, deadline || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
