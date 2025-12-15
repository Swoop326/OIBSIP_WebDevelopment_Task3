import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await userApi.post("/auth/login", form);

      // ✅ USER LOGIN ONLY
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        {message && (
          <p className={`text-center mb-4 ${isError ? "text-red-600" : ""}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-blue-600 text-sm">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
