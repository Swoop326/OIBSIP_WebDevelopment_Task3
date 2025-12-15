import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import userApi from "../api/userApi";
import MockRazorpayModal from "../components/MockRazorpayModal";

export default function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  if (!state) {
    return <p className="p-6">Invalid order</p>;
  }

  const {
    pizza,
    base,
    sauce,
    cheese,
    veggies = [],
    totalPrice,
  } = state;

  const finalBase = base || { name: "Thin Crust", price: 0 };
  const finalSauce = sauce || { name: "Tomato", price: 0 };
  const finalCheese = cheese || { name: "Mozzarella", price: 0 };

  const handlePaymentSuccess = async () => {
    try {
      await userApi.post("/orders/create", {
        pizzaId: pizza._id,
        base: finalBase,
        sauce: finalSauce,
        cheese: finalCheese,
        veggies,
        totalPrice,
      });

      alert("✅ Payment Successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Order failed:", err);

      if (err.response?.status === 401) {
        alert("Please login to place an order.");
        navigate("/login");
      } else {
        alert("❌ Order failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Order Summary 🧾</h1>

      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><b>Pizza:</b> {pizza.name}</p>
        <p><b>Base:</b> {finalBase.name}</p>
        <p><b>Sauce:</b> {finalSauce.name}</p>
        <p><b>Cheese:</b> {finalCheese.name}</p>
        <p><b>Veggies:</b> {veggies.length ? veggies.map(v => v.name).join(", ") : "None"}</p>
        <hr />
        <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
      </div>

      <button
        onClick={() => setShowPayment(true)}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded font-bold"
      >
        Pay Now 💳
      </button>

      {showPayment && (
        <MockRazorpayModal
          amount={totalPrice}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
