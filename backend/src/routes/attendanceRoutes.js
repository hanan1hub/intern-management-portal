const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { markAttendanceRules } = require('../validators/attendanceValidator');
const ctrl = require('../controllers/attendanceController');

router.use(auth);

router.get('/',   ctrl.getAll);
router.post('/',  markAttendanceRules, validate, ctrl.mark);

module.exports = router;
