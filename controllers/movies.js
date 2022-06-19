const Movie = require("../models/movie");
const ForbiddenError = require("../errors/forbiddenError");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => new NotFoundError("Нет фильмов в избранном."))
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({
    owner,
    ...req.body,
  })
    .then((movie) => res.send(movie))
    .catch(() =>
      next(new ValidationError("Необходимо заполнить все поля корректно"))
    );
};

const deleteMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.findOne({ _id: req.params.moviesId })
    .orFail(() => new NotFoundError("Фильм не найдена"))
    .then(async (movie) => {
      if (!movie.owner.equals(owner)) {
        next(new ForbiddenError("Нет прав на удаление этого фильма"));
      } else {
        await Movie.deleteOne(movie);
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Невалидный id фильма"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
