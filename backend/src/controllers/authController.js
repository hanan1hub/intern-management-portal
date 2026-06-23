const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, username: admin.username });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, username, created_at FROM admins WHERE id = $1',
      [req.admin.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Admin not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, current_password, new_password } = req.body;

    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.admin.id]);
    const admin = result.rows[0];
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const valid = await bcrypt.compare(current_password, admin.password_hash);
      if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (username && username !== admin.username) {
      const existing = await pool.query(
        'SELECT id FROM admins WHERE username = $1 AND id != $2',
        [username, admin.id]
      );
      if (existing.rows[0]) return res.status(409).json({ message: 'Username is already taken' });
    }

    const fields = [];
    const params = [];

    if (username && username !== admin.username) {
      params.push(username);
      fields.push(`username = $${params.length}`);
    }
    if (new_password) {
      params.push(await bcrypt.hash(new_password, 10));
      fields.push(`password_hash = $${params.length}`);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No changes provided' });
    }

    params.push(admin.id);
    const updated = await pool.query(
      `UPDATE admins SET ${fields.join(', ')} WHERE id = $${params.length}
       RETURNING id, username, created_at`,
      params
    );

    const newToken = jwt.sign(
      { id: updated.rows[0].id, username: updated.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ admin: updated.rows[0], token: newToken });
  } catch (err) {
    next(err);
  }
};
