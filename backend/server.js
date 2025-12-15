const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const pizzaRoutes = require("./routes/pizza");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Pizza App Backend Running");
});

// API Routes
app.use("/api/auth", authRoutes);    
app.use("/api/pizzas", pizzaRoutes);  
app.use("/api/orders", orderRoutes);
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
