const express = require("express")
const {createExpenseController, getExpenseController} = require("../controller/expenseController")

const router = express.Router()

router.post("/expense/add", createExpenseController)

router.get("/expense",getExpenseController)

module.exports= router