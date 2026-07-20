const { Expense, User } = require("../model/index");
const { Op, fn, col } = require("sequelize");
const sequelize = require("../utils/dbConfig");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const addExpenseService = async (amount, description, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Classify this expense description into exactly one word: "${description}"`,
      config: {
        systemInstruction:
          "You are an expense categorization system. Return exactly ONE word representing the category (e.g., Food, Transport, Utilities, Medical, Entertainment). Do not include periods or extra text. If it cannot be categorized, return 'Other'.",
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
    });
    const expense = await Expense.create(
      {
        amount,
        description,
        category: response.text,
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

const getExpenseService = async (page, limit) => {
  page = Number(page) || 1;
  limit = Number(limit) || 5;

  const offset = (page - 1) * limit;

  const result = await Expense.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const totalPages = Math.ceil(result.count / limit);

  return {
    expenses: result.rows,   // Actual expense records
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      totalItems: result.count,
    },
  };
};

const getExpenseByAllName = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ["isPremium"] });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isPremium) {
    throw new Error("Only premium members can access this feature.");
  }
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

const getExpenseForPremiumMember = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["isPremium", "totalExpense"],
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isPremium) {
    throw new Error("Only premium members can access this feature.");
  }

  const expenseChart = await Expense.findAll({
    where: { userId },
  });

  const totalIncome = expenseChart.reduce(
    (sum, item) => sum + (item.income || 0),
    0,
  );
  const totalExpenses = user.totalExpense;

  const finalAmount = totalIncome - totalExpenses;

  return {
    expenseChart,
    finalAmount,
  };
};

const monthlyExpenseAndIncomeReportService = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["isPremium"],
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isPremium) {
    throw new Error("Only premium members can access this feature.");
  }

  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  end.setHours(23, 59, 59, 999);

  const result = await Expense.findOne({
    where: {
      userId,
      createdAt: {
        [Op.between]: [start, end],
      },
    },
    attributes: [
      [fn("SUM", col("income")), "totalIncome"],
      [fn("SUM", col("amount")), "totalExpense"],
    ],
    raw: true,
  });

  const totalIncome = Number(result.totalIncome) || 0;
  const totalExpense = Number(result.totalExpense) || 0;
 const monthName = start.toLocaleString("en-US", {
  month: "long",
});
  return {
    month: monthName,
  year: start.getFullYear(),
  totalIncome,
  totalExpense,
  savings: totalIncome - totalExpense,
  };
};

const updateExpenseIncomeService = async (id, userId, income) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }
  console.log({
    id,
    userId,
    income,
  });
  const updateIncome = await Expense.update(
    { income },
    {
      where: {
        id,
        userId,
      },
    },
  );

  return updateIncome;
};

module.exports = {
  addExpenseService,
  getExpenseService,
  deleteExpenseService,
  getExpenseByAllName,
  getExpenseForPremiumMember,
  updateExpenseIncomeService,
  monthlyExpenseAndIncomeReportService,
};
