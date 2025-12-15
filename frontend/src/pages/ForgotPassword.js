import { useState } from "react";
import userApi from "../api/userApi"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await userApi.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        {message && (
          <p className={`text-center mb-4 ${isError ? "text-red-600" : ""}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
