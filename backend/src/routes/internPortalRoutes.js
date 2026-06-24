const router     = require('express').Router();
const { body }   = require('express-validator');
const validate   = require('../middleware/validate');
const auth       = require('../middleware/auth');
const internOnly = require('../middleware/internOnly');
const upload     = require('../middleware/upload');
const ctrl       = require('../controllers/internPortalController');

router.use(auth, internOnly);

router.get('/me',       ctrl.getMe);
router.get('/tasks',    ctrl.getMyTasks);
router.put(
  '/tasks/:id/submit',
  upload.single('file'),
  [body('submission_note').optional().trim()],
  validate,
  ctrl.submitTask
);
router.get('/attendance', ctrl.getMyAttendance);

module.exports = router;
