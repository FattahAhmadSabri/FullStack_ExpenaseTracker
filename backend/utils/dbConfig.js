const Sequelize = require("sequelize");


const db = process.env.DB_NAME
const userDb = process.env.DB_USER
const password = process.env.DB_PASSWORD
const sequelize = new Sequelize(db, userDb, password, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

async () => {
  try {
    const result = await sequelize.authenticate;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sequelize;
