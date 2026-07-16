const { createUserService, loginService, forgotPasswordService, updePasswordService } = require("../service/userService");
const { generateToken, verifyToken } = require("../utils/jwtConfig");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandle");

const createUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await createUserService(name, email, password);
    return successResponse(res, 201, "User added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await loginService(email, password);

    if (!response) {
      return errorResponse(res, 401, "Invalid email or password");
    }
    const token = generateToken(response.id);
    return successResponse(res, 200, "Login successfully", response, token);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const forgotPasswordController =async (req,res)=>{
  try {
    const {email} = req.body
    const response = await forgotPasswordService(email)
    return successResponse(res, 200, "Email sent successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }

}


const updatePasswordContoller =async (req,res)=>{
    try {
      const {userId, email} = req.body
      const response =  await updePasswordService(userId, email)
    } catch (error) {
      
    }
}

module.exports = { createUserController, loginController ,forgotPasswordController, updatePasswordContoller};
