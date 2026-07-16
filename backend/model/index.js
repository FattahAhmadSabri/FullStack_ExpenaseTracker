const User = require("./userSchema");

const Expense = require("./expenseSchema");

const ForgotPassword = require("./forgotPassword")

User.hasMany(Expense, {
  ForeignKey: "userId",
});

Expense.belongsTo(User, {
  ForeignKey: "userId",
});

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)
module.exports = {
  User,
  Expense,
  ForgotPassword
};
