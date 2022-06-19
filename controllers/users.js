const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

NODE_ENV === "production" ? JWT_SECRET_KEY : "dev-secret"

const User = require('../models/user');
const ConflictError = require('../errors/conflictError');
const ValidationError = require('../errors/validationError');
const AuthError = require('../errors/authError');
const NotFoundError = require('../errors/notFoundError');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

const getMyProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Данные пользователя не найдены'));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const createUsers = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    next(new ValidationError('Не переданы email или пароль'));
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({ data: `${user.name}` });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => next(new AuthError('Неверный логин или пароль')));
};

const editUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    }).catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  createUsers,
  getMyProfile,
  editUserProfile,
  loginUser,
};
