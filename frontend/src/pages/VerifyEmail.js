import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import userApi from "../api/userApi";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const [params] = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;   
    hasRun.current = true;

    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) {
      setStatus("Invalid verification link");
      return;
    }

    userApi
      .get("/auth/verify-email", {
        params: { token, email },
      })
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus("Invalid or expired link"));
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
