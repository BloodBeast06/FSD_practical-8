import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

function generateOrderNumber() {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `LX-${randomPart}`;
}

router.post("/", async (req, res) => {
  try {
    const { items, customer, payment, totals } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      items,
      customer,
      payment,
      totals
    });

    return res.status(201).json({
      message: "Order placed successfully",
      orderNumber: order.orderNumber,
      orderId: order._id
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to place order" });
  }
});

export default router;
