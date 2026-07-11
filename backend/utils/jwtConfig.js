const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const generateToken = (id) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
