const { celebrate, Joi } = require('celebrate');
const BadRequestError = require('../errors/BadRequestError');

const customUrlValidator = (url) => {
  const urlValidate = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

  if (urlValidate.test(url)) {
    return url;
  }
  throw new BadRequestError('Некорректный URL');
};

const customIdValidator = (id) => {
  const idValidate = /^[0-9a-fA-F]{24}$/;

  if (idValidate.test(id)) {
    return id;
  }
  throw new BadRequestError('Некорректный id');
};

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});


module.exports.validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

module.exports.validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(customUrlValidator),
    trailerLink: Joi.string().required().custom(customUrlValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(customUrlValidator),
    movieId: Joi.number().required(),
  }),
});

module.exports.validationMovieById = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(customIdValidator),
  }),
});
