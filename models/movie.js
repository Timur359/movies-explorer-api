const mongoose = require('mongoose');

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/;

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  descrtiption: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => regex.test(v),
      message: 'Введите корректную ссылку на картинку !',
    },
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => regex.test(v),
      message: 'Введите корректную ссылку на видео !',
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => regex.test(v),
      message: 'Введите корректную ссылку на картинку !',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
