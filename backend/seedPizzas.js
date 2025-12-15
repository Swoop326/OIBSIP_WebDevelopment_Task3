require("dotenv").config();
const mongoose = require("mongoose");
const Pizza = require("./models/Pizza");

const MONGO_URI = process.env.MONGO_URI;

const pizzas = [
  { name: "Margherita", price: 199 },
  { name: "Veggie Supreme", price: 249 },
  { name: "Paneer Tikka", price: 299 },
  { name: "Farmhouse", price: 279 },
  { name: "Mexican Wave", price: 259 }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);

    console.log("Clearing old pizzas...");
    await Pizza.deleteMany({});

    console.log("Inserting new pizzas...");
    await Pizza.insertMany(pizzas);

    console.log("🌟 Pizzas seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding pizzas:", err);
    process.exit(1);
  }
}

seed();
