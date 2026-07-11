const { Expense } = require("../model/index");

const addExpenseService = async (amount, description, category, userId) => {
  const result = await Expense.create({
    amount,
    description,
    category,
    userId,
  });
  return result;
};

const getExpenseService = async () => {
  const result = await Expense.findAll();
  return result;
};

const deleteExpenseService = async (id,userId ) => {
  const result = await Expense.destroy({ where: { id, userId } });
  return result;
};

module.exports = { addExpenseService, getExpenseService, deleteExpenseService };
