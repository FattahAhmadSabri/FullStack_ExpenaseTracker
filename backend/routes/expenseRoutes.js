const express = require("express");
const {
  createExpenseController,
  getExpenseController,
  deleteExpenseController,
  getAllExpenseGroupByUserController,
} = require("../controller/expenseController");
const { inputGuardrail } = require("../middleware/guardrails");
const authMiddleware = require("../middleware/authenticateMiddleware");

const router = express.Router();

router.post(
  "/expense/add",
  authMiddleware,
  inputGuardrail,
  createExpenseController,
);

router.get("/expense", authMiddleware, getExpenseController);

router.get(
  "/expense/premium",
  authMiddleware,
  getAllExpenseGroupByUserController,
);

router.delete("/expense/:id", authMiddleware, deleteExpenseController);

module.exports = router;
