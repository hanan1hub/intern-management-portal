const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createInternRules, updateInternRules } = require('../validators/internValidator');
const ctrl = require('../controllers/internController');

router.use(auth);

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getOne);
router.post('/',    createInternRules, validate, ctrl.create);
router.put('/:id',  updateInternRules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
