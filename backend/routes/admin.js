const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

/**
 * GET all orders (Admin only)
 */
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
});

/**
 * UPDATE order status (Admin only)
 */
router.put("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PLACED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    // ✅ RETURN UPDATED ORDER
    res.json({
      msg: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ msg: "Failed to update order status" });
  }
});

/**
 * GET inventory (Admin only)
 */
router.get("/inventory", adminAuth, async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ itemType: 1 });
    res.json(inventory);
  } catch (err) {
    console.error("FETCH INVENTORY ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch inventory" });
  }
});

/**
 * UPDATE inventory quantity (Admin only)
 */
router.put("/inventory/:id", adminAuth, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ msg: "Quantity cannot be negative" });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Inventory item not found" });
    }

    item.quantity = quantity;
    await item.save();

    res.json({
      msg: "Inventory updated successfully",
      item,
    });
  } catch (err) {
    console.error("UPDATE INVENTORY ERROR:", err);
    res.status(500).json({ msg: "Failed to update inventory" });
  }
});

module.exports = router;
