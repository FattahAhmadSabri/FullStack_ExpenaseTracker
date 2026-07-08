const {createUserService} = require("../service/userService")
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

module.exports= {createUserController}