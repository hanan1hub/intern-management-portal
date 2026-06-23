const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    // backward-compat: admin controllers still read req.admin
    if (req.user.role === 'admin') req.admin = req.user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
