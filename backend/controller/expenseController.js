const {addExpenseService, getExpenseService } =require("../service/expenseService")
const {
    successResponse,
    errorResponse
} = require("../middleware/responseHandle")
const createExpenseController = async (req,res)=>{
    try {
        const {amount,description,category} = req.body
        const response = await addExpenseService(amount,description,category)
        return successResponse(res,201, "amount added successfully", response)
    } catch (error) {
          return errorResponse(res,500, error.message) 
    }
}

const getExpenseController =async(req,res)=>{
    try {
        const response = await getExpenseService()
        return successResponse(res,200, "amount listed successfully", response)
    } catch (error) {
        return errorResponse(res,500, error.message)
    }
}

module.exports={createExpenseController, getExpenseController}