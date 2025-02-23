const crypto = require("crypto");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const razorpay = require("../../helpers/razorpay");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    if (paymentMethod === "cashondelivery") {
      try {
        const order = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await order.save();
        return res.status(200).json({
          success: true,
          message: "Order created successfully",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Some error occured!",
        });
      }
    }
    // 🔹 Online Payment Handling (Razorpay)
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      console.log("online order");
      // Save order in database (For reference & verification)
      const newOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus: "pending", // Payment is not completed yet
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId: razorpayOrder.id, // Store Razorpay Order ID
        payerId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        orderId: newOrder._id,
        razorpayOrder, // Send order details to frontend
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpayOrderId, paymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  // 🔹 Generate Hash using Razorpay secret
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpayOrderId + "|" + paymentId)
    .digest("hex");

  if (generatedSignature === signature) {
    // 🔹 Update Order Status in Database
    console.log('signature matched');
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      paymentId,
    });
    res.json({ success: true, message: "Payment verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Some Error Occured" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  verifyRazorpayPayment,
};
