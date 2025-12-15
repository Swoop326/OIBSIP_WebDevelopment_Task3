const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

/* -------------------------------- REGISTER -------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const emailVerifyToken = uuidv4();

    const user = new User({
      name,
      email: normalizedEmail,
      passwordHash,
      emailVerifyToken,
      emailVerified: false,
    });

    await user.save();

    const verifyLink = `http://localhost:3000/verify-email?token=${emailVerifyToken}&email=${normalizedEmail}`;

    await sendEmail(
      normalizedEmail,
      "Verify your email",
      `<h3>Verify your account</h3>
       <p>Click the link below:</p>
       <a href="${verifyLink}">${verifyLink}</a>`
    );

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------ VERIFY EMAIL ------------------------------ */
router.get("/verify-email", async (req, res) => {
  try {
    const { token, email } = req.query;
    const normalizedEmail = email?.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    // Already verified → still return success
    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    if (user.emailVerifyToken !== token) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.emailVerified = true;
    user.emailVerifyToken = "";
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------- LOGIN --------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------- FORGOT PASSWORD --------------------------- */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${normalizedEmail}`;

    await sendEmail(
      normalizedEmail,
      "Reset your password",
      `<h3>Password Reset</h3>
       <p>Click the link below to reset your password:</p>
       <a href="${resetLink}">${resetLink}</a>`
    );

    return res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------- RESET PASSWORD ----------------------------- */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    const normalizedEmail = email?.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (
      !user ||
      user.resetPasswordToken !== token ||
      Date.now() > user.resetPasswordExpires
    ) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
