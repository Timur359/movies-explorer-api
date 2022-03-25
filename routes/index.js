const router = require('express').Router();

const { validLogin, validRegistr } = require('../middlewares/validation');
const { createUsers, loginUser } = require('../controllers/users');

router.post('/api/signup', validRegistr, createUsers);
router.post('/api/signin', validLogin, loginUser);

module.exports = router;
