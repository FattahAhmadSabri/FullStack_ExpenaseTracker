const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

 const createOrder = async (
  orderId,
  orderAmount,
  customerId,
  customerPhone,
  orderCurrency = "INR"
) => {
  try {
    
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    
    const request = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: orderCurrency,

      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },

      order_meta: {
        return_url:
          "http://localhost:5173/payment-success?order_id={order_id}",
        notify_url:
          "http://localhost:4000/api/payment/webhook",
        payment_methods: "cc,dc,upi",
      },

      order_expiry_time: expiryDate.toISOString(),
    };

    const response = await cashfree.PGCreateOrder(request);

    return response.data;
  } catch (error) {
    console.error(
      "Cashfree Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to create Cashfree order."
    );
  }
};

module.exports =createOrder