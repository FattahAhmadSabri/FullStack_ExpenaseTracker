const User = require("../model/userSchema");
const { hashPassword, comparePassword } = require("../middleware/bcryptConfig");
const sendEmail = require("./emailService")

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

  if (!comparedPassword) {
    return false;
  }

  const data = user.toJSON();

  delete data.password;

  return data;
};


const forgotPasswordService = async (email) => {
  const matchEmail = await User.findOne({
    where: { email },
  });

  if (!matchEmail) {
    return false;
  }

  await sendEmail(
    matchEmail.email,
    "OTP for Email Verification",
    "<h1>110011</h1>"
  );

  return true;
};


module.exports = { createUserService, loginService, forgotPasswordService };
