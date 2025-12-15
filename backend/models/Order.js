const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pizza: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pizza",
        required: true,
      },
      name: String,
      basePrice: Number,
    },

    base: optionSchema,
    sauce: optionSchema,
    cheese: optionSchema,

    veggies: [optionSchema],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
