const express = require("express");
const Order = require("../models/Order");
const Pizza = require("../models/Pizza");
const Inventory = require("../models/Inventory");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Create Order
router.post("/create", auth, async (req, res) => {
  try {
    const { pizzaId, base, sauce, cheese, veggies, totalPrice } = req.body;

    // Fetch pizza
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    // Create order
    const order = new Order({
      userId: req.user.id,

      pizza: {
        id: pizza._id,
        name: pizza.name,
        basePrice: pizza.price,
      },

      base,
      sauce,
      cheese,
      veggies,

      totalPrice,
      paymentStatus: "PAID", 
      orderStatus: "PLACED",
    });

    await order.save();

    // Invetory Deduction 
    try {
      const LOW_STOCK_THRESHOLD = 20;

      const itemsUsed = [
        base?.name,
        sauce?.name,
        cheese?.name,
        ...(veggies || []).map(v => v.name),
      ];

      for (const itemName of itemsUsed) {
        if (!itemName) continue;

        const updatedItem = await Inventory.findOneAndUpdate(
          { name: itemName },
          { $inc: { quantity: -1 } },
          { new: true }
        );

        // Low stock email alert
        if (updatedItem && updatedItem.quantity <= LOW_STOCK_THRESHOLD) {
          await sendEmail(
            process.env.ADMIN_EMAIL,
            "⚠️ Low Stock Alert - Pizza App",
            `
              <h3>Low Stock Warning</h3>
              <p><strong>Item:</strong> ${updatedItem.name}</p>
              <p><strong>Remaining Quantity:</strong> ${updatedItem.quantity}</p>
              <p>Please restock this item soon.</p>
            `
          );
        }
      }
    } catch (invErr) {
      console.error("Inventory / Low-stock check failed:", invErr);
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


module.exports = router;
