const User = require("../model/userSchema");
const { hashPassword, comparePassword } = require("../middleware/bcryptConfig");

const createUserService = async (name, email, password) => {
  const hashedPassword = await hashPassword(password);
  const result = await User.create({ name, email, password: hashedPassword });
  const data = result.toJSON();
  delete data.password;
  return data;
};

const loginService = async (email, password) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    return false;
  }
  const comparedPassword = await comparePassword(password, user.password);
  return comparedPassword;
};

module.exports = { createUserService, loginService };
