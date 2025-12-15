const express = require("express");
const Pizza = require("../models/Pizza");
const router = express.Router();

/**
 * GET /api/pizzas
 * Public route – fetch all available pizzas
 */
router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    return res.status(200).json(pizzas);
  } catch (err) {
    console.error("PIZZA FETCH ERROR:", err);
    return res.status(500).json({ message: "Error fetching pizzas" });
  }
});

module.exports = router;
