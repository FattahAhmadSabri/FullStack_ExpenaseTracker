const User = require("../model/userSchema");
const {ForgotPassword} = require("../model/index")
const { hashPassword, comparePassword } = require("../middleware/bcryptConfig");
const sendEmail = require("./emailService")
const sequelize =require("../utils/dbConfig")

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
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { email },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return false;
    }

    await ForgotPassword.update(
      { isActive: false },
      {
        where: {
          userId: user.id,
          isActive: true,
        },
        transaction,
      }
    );

    const resetRequest = await ForgotPassword.create(
      {
        userId: user.id,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
      { transaction }
    );

    await transaction.commit();

    await sendEmail(
      user.email,
      "Reset Password",
      `
      <a href="http://localhost:4000/user/password/reset/${resetRequest.id}">
        Reset Password
      </a>
      `
    );

    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updePasswordService =async (userId,password)=>{
  const hashedPassword = await hashPassword(password);
      const updatedPassword = User.update({password : hashedPassword},{
        where : {useId}
      })
      return true
}


module.exports = { createUserService, loginService, forgotPasswordService, updePasswordService };
