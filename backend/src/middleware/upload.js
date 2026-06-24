const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file,  cb) => {
    const rand = crypto.randomBytes(10).toString('hex');
    const ext  = path.extname(file.originalname);
    cb(null, `${Date.now()}-${rand}${ext}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB cap
});
