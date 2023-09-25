const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

// Error
const NotFoundError = require('../errors/NotFoundError');

// Validation
const {
  validationCreateUser,
  validationLogin,
} = require('../middlewares/validation');

// вызов роутеров для пользователей и карточек
router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', users);
router.use('/movies', movies);

router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
