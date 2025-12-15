import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "PLACED", label: "PLACED" },
  { value: "PREPARING", label: "PREPARING" },
  { value: "OUT_FOR_DELIVERY", label: "OUT FOR DELIVERY" },
  { value: "DELIVERED", label: "DELIVERED" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // 👈 prevents double updates
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
      if (err.response?.status === 401) {
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await adminApi.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      // ✅ Update UI only after backend success
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
      if (err.response?.status === 401) {
        navigate("/admin-login");
      } else {
        alert("Failed to update order status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading orders...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders Management</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-left">Pizza</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">
                  {/* ✅ NULL SAFE */}
                  {order.userId?.email || "Deleted User"}
                </td>

                <td className="border p-2">{order.pizza.name}</td>
                <td className="border p-2">₹{order.totalPrice}</td>

                <td className="border p-2">
                  <select
                    value={order.orderStatus}
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border p-1 rounded disabled:bg-gray-200"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
