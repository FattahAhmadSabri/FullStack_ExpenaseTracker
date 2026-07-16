const express = require("express");

const {
  createUserController,
  loginController,forgotPasswordController, updatePasswordContoller
} = require("../controller/userController");

const router = express.Router();

router.post("/user/register", createUserController);
router.post("/user/login", loginController);
router.post("/user/password/forgotPassword", forgotPasswordController)
router.patch("/user/password/reset/:id", updatePasswordContoller)

module.exports = router;
