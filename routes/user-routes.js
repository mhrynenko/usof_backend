const express = require('express');
const user = require('../controllers/user-controller');
const checkRole = require('../middleware/role-middleware');
const checkAuth = require('../middleware/auth-middleware');

const router = express.Router();

router.get ('/api/users', checkRole('admin'), user.getAll);
router.get ('/api/users/:user_id', checkRole('admin'), user.getOne);
router.post ('/api/users/', checkRole('admin'), user.create);
router.patch ('/api/users/avatar', checkRole('admin'), user.avatar)
router.patch ('/api/users/:user_id', checkAuth, user.userData);
router.delete ('/api/users/:user_id', checkAuth, user.deleteOne);

module.exports = router;