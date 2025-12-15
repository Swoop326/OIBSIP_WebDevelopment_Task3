import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedQty, setEditedQty] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await adminApi.get("/admin/inventory");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
      if (err.response?.status === 401) {
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save ONLY on button click
  const handleSave = async (id) => {
    try {
      await adminApi.put(`/admin/inventory/${id}`, {
        quantity: Number(editedQty[id]),
      });

      // Refresh inventory
      fetchInventory();

      // Clear temp value
      setEditedQty((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update quantity", err);
      if (err.response?.status === 401) {
        navigate("/admin-login");
      } else {
        alert("Failed to update quantity");
      }
    }
  };

  if (loading) return <p className="text-gray-600">Loading inventory...</p>;

  return (
    <table className="w-full border">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          <th className="border p-2">Type</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => {
          const isEdited = editedQty[item._id] !== undefined;

          return (
            <tr key={item._id}>
              <td className="border p-2 capitalize">{item.itemType}</td>
              <td className="border p-2">{item.name}</td>

              <td className="border p-2">
                <input
                  type="number"
                  value={isEdited ? editedQty[item._id] : item.quantity}
                  onChange={(e) =>
                    setEditedQty((prev) => ({
                      ...prev,
                      [item._id]: e.target.value,
                    }))
                  }
                  className="border p-1 w-20"
                />
                {isEdited && (
                  <span className="text-orange-500 text-xs ml-2">
                    Unsaved
                  </span>
                )}
              </td>

              <td className="border p-2">
                <button
                  onClick={() => handleSave(item._id)}
                  disabled={!isEdited}
                  className={`px-3 py-1 rounded text-sm ${
                    isEdited
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
