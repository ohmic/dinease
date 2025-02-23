const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  verifyRazorpayPayment
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/verify-payment", verifyRazorpayPayment);
// router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
