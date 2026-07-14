const { Expense, User } = require("../model/index");
const { fn, col } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const addExpenseService = async (amount, description, category, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        userId,
      },
      { transaction },
    );

    await User.increment(
      { totalExpense: Number(amount) },
      {
        where: { id: userId },
        transaction,
      },
    );

    await transaction.commit();

    return expense;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getExpenseService = async () => {
  const result = await Expense.findAll();
  return result;
};

const getExpenseByAllName = async () => {
  const result = await User.findAll({
    order: [[col("totalExpense"), "DESC"]],
  });

  return result;
};

const deleteExpenseService = async (id, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.findOne({
      where: { id, userId },
      transaction,
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    await Expense.destroy({
      where: { id, userId },
      transaction,
    });

    await User.decrement(
      { totalExpense: Number(expense.amount) },
      {
        where: { id: userId },
        transaction,
      },
    );

    await transaction.commit();

    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  addExpenseService,
  getExpenseService,
  deleteExpenseService,
  getExpenseByAllName,
};
