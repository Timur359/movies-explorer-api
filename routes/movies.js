const express = require('express');

const router = express.Router();

const { getMovies, createMovies, deleteMovies } = require('../controllers/movies');
const { validPostMovie, validId } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', validPostMovie, createMovies);

router.delete('/movies/:moviesId', validId, deleteMovies);

module.exports = router;
