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
      `SELECT id, title, description, status, deadline,
              submission_note, submitted_at,
              submission_file_path, submission_file_original,
              submission_file_mime, submission_file_size,
              created_at
       FROM tasks WHERE intern_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

/* PUT /api/intern/tasks/:id/submit  (multipart/form-data) */
exports.submitTask = async (req, res, next) => {
  try {
    const { submission_note } = req.body;

    const check = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND intern_id = $2',
      [req.params.id, req.user.id]
    );
    if (!check.rows[0]) return res.status(404).json({ message: 'Task not found' });

    const result = await pool.query(
      `UPDATE tasks
       SET status                   = 'completed',
           submission_note          = $1,
           submitted_at             = NOW(),
           submission_file_path     = COALESCE($2, submission_file_path),
           submission_file_original = COALESCE($3, submission_file_original),
           submission_file_mime     = COALESCE($4, submission_file_mime),
           submission_file_size     = COALESCE($5, submission_file_size)
       WHERE id = $6 AND intern_id = $7
       RETURNING *`,
      [
        submission_note            || null,
        req.file?.filename         || null,
        req.file?.originalname     || null,
        req.file?.mimetype         || null,
        req.file?.size             || null,
        req.params.id,
        req.user.id,
      ]
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
