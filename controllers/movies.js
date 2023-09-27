const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { HTTP_STATUS } = require('../constants');

// Errors
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ userId })
    .then((movie) => res.status(HTTP_STATUS.OK).send({ movie }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const userId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => {
      res.status(HTTP_STATUS.CREATED).send({ movie });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании фильма',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const ownerId = req.user._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }

      if (movie.owner.toString() !== ownerId) {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }
      return Movie.deleteOne(movie).then(() => res.status(HTTP_STATUS.OK).send({ message: 'DELETE' }));
    })
    .catch(next);
};
