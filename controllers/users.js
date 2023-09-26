const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const { SALT_ROUNDS, HTTP_STATUS } = require('../constants');

// Errors
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS, (error, hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then(() => {
        res.status(HTTP_STATUS.CREATED).send({
          data: {
            name, email,
          },
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new ConflictError('Пользователь с таким email уже существует'),
          );
        } if (err instanceof mongoose.Error.ValidationError) {
          return next(
            new BadRequestError(
              'Переданы некорректные данные при создании пользователя',
            ),
          );
        }
        return next(err);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
        .send({ email });
    })
    .catch(next);
};

module.exports.currentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(HTTP_STATUS.OK).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с таким email уже существует'),
        );
      } if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      }
      return next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('token'); // Удаляем куку с именем 'token'
  res.status(HTTP_STATUS.OK).json({ message: 'Выход выполнен успешно' });
};
