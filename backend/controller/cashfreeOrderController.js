const createOrder = require("../service/cashfreepaymentsService")
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandle");

const cashfreeOrderController =async (req,res)=>{
   try {
    const customerId = req.user.id
    const orderId = Date.now() +"-" +Math.random()
     const { orderAmount, customerPhone } = req.body;
   const order = await createOrder(orderId, orderAmount, customerId, customerPhone)
   return successResponse(res, 201, "payment successfully", order);
   } catch (error) {
    return errorResponse(res, 500, error.message);
   }

}

module.exports={cashfreeOrderController}