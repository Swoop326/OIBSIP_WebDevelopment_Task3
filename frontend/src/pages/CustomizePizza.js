import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

/* OPTIONS */
const BASES = [
  { name: "Thin Crust", price: 0 },
  { name: "Cheese Burst", price: 80 },
  { name: "Whole Wheat", price: 40 },
  { name: "Pan Base", price: 60 },
  { name: "Stuffed Crust", price: 90 },
];

const SAUCES = [
  { name: "Tomato", price: 0 },
  { name: "BBQ", price: 30 },
  { name: "Pesto", price: 35 },
  { name: "White Sauce", price: 25 },
  { name: "Spicy Red", price: 30 },
];

const CHEESES = [
  { name: "Mozzarella", price: 0 },
  { name: "Cheddar", price: 45 },
  { name: "Parmesan", price: 50 },
];

const VEGGIES = [
  { name: "Onion", price: 15 },
  { name: "Capsicum", price: 20 },
  { name: "Mushroom", price: 25 },
  { name: "Olives", price: 30 },
  { name: "Jalapeno", price: 20 },
];

export default function CustomizePizza() {
  const { state: pizza } = useLocation();
  const navigate = useNavigate();

  const [base, setBase] = useState(BASES[0]);
  const [sauce, setSauce] = useState(SAUCES[0]);
  const [cheese, setCheese] = useState(CHEESES[0]);
  const [veggies, setVeggies] = useState([]);

  const toggleVeggie = (veg) => {
    setVeggies((prev) =>
      prev.find((v) => v.name === veg.name)
        ? prev.filter((v) => v.name !== veg.name)
        : [...prev, veg]
    );
  };

  const totalPrice =
    pizza.price +
    base.price +
    sauce.price +
    cheese.price +
    veggies.reduce((s, v) => s + v.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Customize {pizza.name} 🍕</h1>
      <p className="mb-6">Base Price: ₹{pizza.price}</p>

      {/* BASE */}
      <h2 className="font-bold mb-2">Choose Base</h2>
      <div className="flex gap-3 flex-wrap mb-6">
        {BASES.map((b) => (
          <button
            key={b.name}
            onClick={() => setBase(b)}
            className={`px-4 py-2 rounded border ${
              base.name === b.name ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {b.name} {b.price === 0 ? "(Default)" : `(+₹${b.price})`}
          </button>
        ))}
      </div>

      {/* SAUCE */}
      <h2 className="font-bold mb-2">Choose Sauce</h2>
      <div className="flex gap-3 flex-wrap mb-6">
        {SAUCES.map((s) => (
          <button
            key={s.name}
            onClick={() => setSauce(s)}
            className={`px-4 py-2 rounded border ${
              sauce.name === s.name ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            {s.name} {s.price === 0 ? "(Default)" : `(+₹${s.price})`}
          </button>
        ))}
      </div>

      {/* CHEESE */}
      <h2 className="font-bold mb-2">Choose Cheese</h2>
      <div className="flex gap-3 flex-wrap mb-6">
        {CHEESES.map((c) => (
          <button
            key={c.name}
            onClick={() => setCheese(c)}
            className={`px-4 py-2 rounded border ${
              cheese.name === c.name ? "bg-yellow-500 text-white" : "bg-white"
            }`}
          >
            {c.name} {c.price === 0 ? "(Default)" : `(+₹${c.price})`}
          </button>
        ))}
      </div>

      {/* VEGGIES */}
      <h2 className="font-bold mb-2">Choose Veggies</h2>
      <div className="flex gap-3 flex-wrap mb-6">
        {VEGGIES.map((v) => (
          <button
            key={v.name}
            onClick={() => toggleVeggie(v)}
            className={`px-4 py-2 rounded border ${
              veggies.find((x) => x.name === v.name)
                ? "bg-purple-600 text-white"
                : "bg-white"
            }`}
          >
            {v.name} (+₹{v.price})
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
      </div>

      <button
        onClick={() =>
          navigate("/order-summary", {
            state: { pizza, base, sauce, cheese, veggies, totalPrice },
          })
        }
        className="bg-red-600 text-white px-6 py-3 rounded font-bold"
      >
        Review Order 🧾
      </button>
    </div>
  );
}
