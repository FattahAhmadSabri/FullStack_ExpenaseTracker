const User = require("../model/userSchema");

const createUserService = async (name, email, password) => {
  const result = await User.create({ name, email, password });
  const data = result.toJSON();
  delete data.password;
  return data;
};

const loginService = async (email, password) => {
  const user = await User.findOne({
    where: {
      email,
      password,
    },
  });
  if (user) {
    return true;
  }
  return false;
};

module.exports = { createUserService, loginService };
