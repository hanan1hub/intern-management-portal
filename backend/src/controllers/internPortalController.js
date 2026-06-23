const pool = require('../config/db');

/* GET /api/intern/me */
exports.getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, department, joining_date, created_at FROM interns WHERE id = $1',
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Intern not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

/* GET /api/intern/tasks */
exports.getMyTasks = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, status, deadline, submission_note, submitted_at, created_at
       FROM tasks WHERE intern_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

/* PUT /api/intern/tasks/:id/submit */
exports.submitTask = async (req, res, next) => {
  try {
    const { submission_note } = req.body;
    // Verify this task belongs to the logged-in intern
    const check = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND intern_id = $2',
      [req.params.id, req.user.id]
    );
    if (!check.rows[0]) return res.status(404).json({ message: 'Task not found' });

    const result = await pool.query(
      `UPDATE tasks
       SET status          = 'completed',
           submission_note = $1,
           submitted_at    = NOW()
       WHERE id = $2 AND intern_id = $3
       RETURNING *`,
      [submission_note || null, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

/* GET /api/intern/attendance */
exports.getMyAttendance = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, date, status, notes, created_at
       FROM attendance WHERE intern_id = $1 ORDER BY date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};
