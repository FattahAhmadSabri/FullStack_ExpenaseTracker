const express = require("express")
const {createExpenseController, getExpenseController, deleteExpenseController} = require("../controller/expenseController")

const router = express.Router()

router.post("/expense/add", createExpenseController)

router.get("/expense",getExpenseController)

router.delete("/expense/:id",deleteExpenseController)

module.exports= router