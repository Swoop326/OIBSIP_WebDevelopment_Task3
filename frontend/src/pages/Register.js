import { useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../api/userApi"; 

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await userApi.post("/auth/register", form);
      setMessage(res.data.message);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

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
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
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

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
