import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import userApi from "../api/userApi"; // ✅ FIXED

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await userApi.post("/auth/reset-password", {
        email: params.get("email"),
        token: params.get("token"),
        newPassword: password,
      });

      setMessage(res.data.message);
    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Invalid or expired reset link"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h1>

        {message && (
          <p
            className={`text-center mb-4 ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
