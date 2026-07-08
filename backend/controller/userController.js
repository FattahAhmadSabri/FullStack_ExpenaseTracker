const {createUserService, loginService} = require("../service/userService")
const {
    successResponse,
    errorResponse
} = require("../middleware/responseHandle")

const createUserController =async(req,res)=>{
    try {
        const {name,email,password} =req.body
       const response = await createUserService(name,email,password) 
        return successResponse(res,201, "User added successfully", response)
    } catch (error) {
       return errorResponse(res,500, error.message) 
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const response = await loginService(email, password);

        if (!response) {
            return errorResponse(
                res,
                401,
                "Invalid email or password"
            );
        }

        return successResponse(
            res,
            200,
            "Login successfully",
            response
        );

    } catch (error) {
        return errorResponse(
            res,
            500,
            error.message
        );
    }
};

module.exports= {createUserController, loginController}