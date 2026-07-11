const express = require("express");
const authMiddleware = require("../middleware/authenticateMiddleware");
const {
  cashfreeOrderController,
} = require("../controller/cashfreeOrderController");

const router = express.Router();

router.post("/payments/create_order", authMiddleware, cashfreeOrderController);

module.exports = router