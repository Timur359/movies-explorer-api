const Card = require("../models/movie");
const ForbiddenError = require("../errors/forbiddenError");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");

const getMovies = (req, res, next) => {
  Card.find()
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

const createMovies = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const movieId = req.user._id;
  console.log(req);
  Card.create({
    name, link, owner, movieId,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => next(new ValidationError(err)));
};

const deleteMovies = (req, res, next) => {
  const owner = req.user._id;
  Card.findOne({ _id: req.params.moviesId })
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then(async (card) => {
      if (!card.owner.equals(owner)) {
        next(new ForbiddenError("Нет прав на удаление этой карточки"));
      } else {
        await Card.deleteOne(card);
        return res.status(200).send({ message: "Карточка удалена" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Невалидный id карточки"));
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
