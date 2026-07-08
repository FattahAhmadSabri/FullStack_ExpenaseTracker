const express = require("express");

const {
  createUserController,
  loginController,
} = require("../controller/userController");

const router = express.Router();

router.post("/user/register", createUserController);
router.post("/user/login", loginController);

module.exports = router;
