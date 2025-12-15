import { useEffect, useState } from "react";
import userApi from "../api/userApi";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await userApi.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-600">No orders placed yet.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded p-4 bg-white shadow"
          >
            <p>
              <strong>Pizza:</strong> {order.pizza.name}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="font-semibold text-blue-600">
                {order.orderStatus}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Ordered on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
