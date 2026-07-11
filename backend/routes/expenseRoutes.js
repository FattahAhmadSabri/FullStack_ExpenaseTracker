const express = require("express")
const {createExpenseController, getExpenseController, deleteExpenseController} = require("../controller/expenseController")
const authMiddleware = require("../middleware/authenticateMiddleware")

const router = express.Router()

router.post("/expense/add",authMiddleware, createExpenseController)

router.get("/expense",authMiddleware,getExpenseController)

router.delete("/expense/:id",authMiddleware, deleteExpenseController)

module.exports= router