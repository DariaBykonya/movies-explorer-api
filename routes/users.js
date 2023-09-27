const router = require('express').Router();
const {
  currentUser,
  updateUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  // validationUserId,
} = require('../middlewares/validation');

router.get('/me', currentUser);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
