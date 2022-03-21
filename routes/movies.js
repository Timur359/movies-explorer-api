const express = require("express");
const { celebrate, Joi } = require("celebrate");

const router = express.Router();

const {
  getMovies,
  createMovies,
  deleteMovies,
} = require("../controllers/movies");

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/;

router.get("/movies", getMovies);
router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regex),
      trailerLink: Joi.string().required().pattern(regex),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(regex),
      movieId: Joi.string().required(),
    }),
  }),
  createMovies,
);

router.delete(
  "/movies/:moviesId",
  celebrate({
    params: Joi.object().keys({
      moviesId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteMovies,
);

module.exports = router;
