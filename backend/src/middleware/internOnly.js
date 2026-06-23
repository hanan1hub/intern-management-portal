module.exports = (req, res, next) => {
  if (req.user?.role !== 'intern') {
    return res.status(403).json({ message: 'Intern access required' });
  }
  next();
};
