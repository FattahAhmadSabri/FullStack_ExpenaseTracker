const {
  addExpenseService,
  getExpenseService,
  deleteExpenseService,
  getExpenseByAllName,
} = require("../service/expenseService");

const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandle");
const createExpenseController = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
    const totalExpense = req.user.totalExpense +amount
    const response = await addExpenseService(
      amount,
      description,
      category,
      userId,
    );
    return successResponse(res, 201, "amount added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getExpenseController = async (req, res) => {
  try {
    const response = await getExpenseService();
    return successResponse(res, 200, "amount listed successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllExpenseGroupByUserController = async (req, res) => {
  try {
    const response = await getExpenseByAllName();
    return successResponse(res, 200, "amount listed successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteExpenseController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const response = await deleteExpenseService(id, userId);
    return successResponse(res, 200, "Expens deleted successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createExpenseController,
  getExpenseController,
  deleteExpenseController,
  getAllExpenseGroupByUserController,
};
