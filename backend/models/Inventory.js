const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["base", "sauce", "cheese", "veggie"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
