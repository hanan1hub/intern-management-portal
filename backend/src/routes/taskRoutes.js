const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTaskRules, updateTaskRules } = require('../validators/taskValidator');
const ctrl = require('../controllers/taskController');

router.use(auth);

router.get('/',      ctrl.getAll);
router.post('/',     createTaskRules, validate, ctrl.create);
router.put('/:id',   updateTaskRules, validate, ctrl.updateStatus);

module.exports = router;
