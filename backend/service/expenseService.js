const { Expense, User } = require("../model/index");
const { fn, col } = require("sequelize");

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

const getExpenseByAllName = async () => {
  const result = await Expense.findAll({
    attributes: [
      [col("User.name"), "name"],
      [fn("SUM", col("amount")), "totalAmount"],
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
    group: ["User.id", "User.name"],
  });

  return result;
};

const deleteExpenseService = async (id, userId) => {
  const result = await Expense.destroy({ where: { id, userId } });
  return result;
};

module.exports = {
  addExpenseService,
  getExpenseService,
  deleteExpenseService,
  getExpenseByAllName,
};
