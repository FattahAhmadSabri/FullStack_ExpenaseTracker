const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense_db", "root", "@SQL321", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

async () => {
  try {
    const result = await sequelize.authenticate;
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sequelize;
