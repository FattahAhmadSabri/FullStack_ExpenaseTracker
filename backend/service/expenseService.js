const { Expense, User } = require("../model/index");
const { fn, col } = require("sequelize");
const sequelize = require("../utils/dbConfig");
const {GoogleGenAI} = require("@google/genai")
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
            systemInstruction: "You are an expense categorization system. Return exactly ONE word representing the category (e.g., Food, Transport, Utilities, Medical, Entertainment). Do not include periods or extra text. If it cannot be categorized, return 'Other'.",
            safetySettings: [
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
            ]
          }
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
