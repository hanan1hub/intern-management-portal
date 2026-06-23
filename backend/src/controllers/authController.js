const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const signAdmin = (admin) =>
  jwt.sign(
    { id: admin.id, username: admin.username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

/* ── Admin login ── */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin  = result.rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({ token: signAdmin(admin), username: admin.username, role: 'admin' });
  } catch (err) { next(err); }
};

/* ── Intern login (email + password) ── */
exports.internLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM interns WHERE email = $1', [email]);
    const intern = result.rows[0];
    if (!intern || !intern.password_hash) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!(await bcrypt.compare(password, intern.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: intern.id, name: intern.name, email: intern.email, role: 'intern' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      role:  'intern',
      name:  intern.name,
      email: intern.email,
    });
  } catch (err) { next(err); }
};

/* ── Admin profile ── */
exports.getProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, username, created_at FROM admins WHERE id = $1',
      [req.admin.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Admin not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, current_password, new_password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.admin.id]);
    const admin  = result.rows[0];
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      if (!(await bcrypt.compare(current_password, admin.password_hash))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
    }

    if (username && username !== admin.username) {
      const dup = await pool.query(
        'SELECT id FROM admins WHERE username = $1 AND id != $2',
        [username, admin.id]
      );
      if (dup.rows[0]) return res.status(409).json({ message: 'Username is already taken' });
    }

    const fields = [], params = [];
    if (username && username !== admin.username) {
      params.push(username);
      fields.push(`username = $${params.length}`);
    }
    if (new_password) {
      params.push(await bcrypt.hash(new_password, 10));
      fields.push(`password_hash = $${params.length}`);
    }
    if (!fields.length) return res.status(400).json({ message: 'No changes provided' });

    params.push(admin.id);
    const updated = await pool.query(
      `UPDATE admins SET ${fields.join(', ')} WHERE id = $${params.length}
       RETURNING id, username, created_at`,
      params
    );

    res.json({ admin: updated.rows[0], token: signAdmin(updated.rows[0]) });
  } catch (err) { next(err); }
};
