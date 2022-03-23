require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const rateLimiter = require('./middlewares/rateLimit');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const auth = require('./middlewares/auth');
const { apiLogger, errLogger } = require('./middlewares/logger');
const { createUsers, loginUser } = require('./controllers/users');
const NotFoundError = require('./errors/notFoundError');
const errorHandler = require('./errors/errorHandler');

const app = express();

const PORT = 3000;
const db = 'mongodb://localhost:27017/bitfilmsdb';

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));

const whitelist = ['http://localhost:3000', 'https://movies-explorer-dip.nomoredomains.work', 'http://movies-explorer-dip.nomoredomains.work'];
const corsOptions = {
  origin: whitelist,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);

app.use(helmet());

app.use(rateLimiter);

app.get('/api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/api/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUsers,
);
app.post(
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);

app.use('/api/', auth, usersRoutes);
app.use('/api/', auth, moviesRoutes);
app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});

console.log(process.env.JWT_SECRET_KEY);
