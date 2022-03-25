const express = require('express');

const router = express.Router();

const { editUserProfile, getMyProfile } = require('../controllers/users');
const { validPatchUser } = require('../middlewares/validation');

router.get('/users/me', getMyProfile);
router.patch('/users/me', validPatchUser, editUserProfile);

module.exports = router;
