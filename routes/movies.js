const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validationCreateMovie,
  validationMovieById,
} = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
// router.delete('/:cardId', validationCardById, deleteCard);
// router.put('/:cardId/likes', validationCardById, likeCard);
router.delete('/:id', validationMovieById, deleteMovie);

module.exports = router;
