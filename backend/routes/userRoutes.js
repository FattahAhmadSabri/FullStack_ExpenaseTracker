const express = require("express")

const {createUserController} = require("../controller/userController")

const router = express.Router()

router.post("/user",createUserController)

module.exports= router