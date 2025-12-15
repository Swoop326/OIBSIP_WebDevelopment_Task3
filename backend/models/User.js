const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
