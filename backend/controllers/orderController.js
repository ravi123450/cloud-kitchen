import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import { emitOrderUpdate } from "../socket.js"; // Import socket emit function

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the new order and get its MongoDB ID
    const savedOrder = await newOrder.save();

    // Create a Razorpay order
    const options = {
      amount: req.body.amount * 100, // Amount in paise
      currency: "INR",
      receipt: savedOrder._id.toString(), // Use MongoDB ID as the receipt ID
      payment_capture: 1, // Auto-capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update the order with the Razorpay order ID
    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    // Emit the new order to all connected admins
    emitOrderUpdate(savedOrder);

    // Send the Razorpay order details to the frontend
    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error placing order." });
  }
};

// Verify Order
const verifyOrder = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    // Find the order using Razorpay order ID
    const order = await orderModel.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Verify payment signature using Razorpay SDK
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Mark the order as paid
      order.payment = true;
      await order.save();
      res.json({ success: true, message: "Payment verified successfully." });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature." });
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ success: false, message: "Error verifying payment." });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
