const express = require("express");
const { celebrate, Joi } = require("celebrate");

const router = express.Router();

const { editUserProfile, getMyProfile } = require("../controllers/users");

router.get("/users/me", getMyProfile);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  editUserProfile,
);

module.exports = router;
