const User = require("./userSchema");

const Expense = require("./expenseSchema");

User.hasMany(Expense, {
  ForeignKey: "userId",
});

Expense.belongsTo(User, {
  ForeignKey: "userId",
});

module.exports = {
  User,
  Expense,
};
