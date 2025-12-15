import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
import MyOrders from "../components/MyOrders";

export default function Dashboard() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔒 Protect USER dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🍕 Load pizzas
  useEffect(() => {
    async function loadPizzas() {
      try {
        const res = await userApi.get("/pizzas");
        setPizzas(res.data);
      } catch (err) {
        console.error("Failed to load pizzas", err);
      } finally {
        setLoading(false);
      }
    }
    loadPizzas();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCustomize = (pizza) => {
    navigate(`/customize/${pizza._id}`, { state: pizza });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard 🍕</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Pizza List */}
      <h2 className="text-2xl font-semibold mb-4">Available Pizzas</h2>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="bg-white p-5 rounded shadow">
            <h2 className="text-xl font-bold">{pizza.name}</h2>
            <p className="text-gray-600 mb-4">₹{pizza.price}</p>
            <button
              onClick={() => handleCustomize(pizza)}
              className="bg-yellow-500 text-white py-2 w-full rounded"
            >
              Customize 🍕
            </button>
          </div>
        ))}
      </div>

      {/* My Orders Section */}
      <div className="mt-12">
        <MyOrders />
      </div>
    </div>
  );
}
