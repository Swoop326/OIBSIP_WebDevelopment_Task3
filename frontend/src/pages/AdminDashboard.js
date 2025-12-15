import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminInventory from "../components/AdminInventory";
import AdminOrders from "../components/AdminOrders";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    // 🔒 HARD ADMIN GUARD
    if (!adminToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // 🔥 Clear ALL sessions
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");

    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-black text-white px-6 py-4">
        <h1 className="text-xl font-bold">Admin Dashboard 🍕</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Inventory Section */}
        <div className="bg-white rounded shadow h-[75vh] flex flex-col">
          <h2 className="text-xl font-semibold p-4 border-b">
            Inventory Management
          </h2>
          <div className="p-4 overflow-y-auto flex-1">
            <AdminInventory />
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded shadow h-[75vh] flex flex-col">
          <h2 className="text-xl font-semibold p-4 border-b">
            Orders Management
          </h2>
          <div className="p-4 overflow-y-auto flex-1">
            <AdminOrders />
          </div>
        </div>

      </div>
    </div>
  );
}
