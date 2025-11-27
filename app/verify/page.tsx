"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateVerified } from "../features/authSlice";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // --------------------------
  // VERIFY CODE
  // --------------------------
  const verify = async () => {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email: user?.email, code }),
    });

    const data = await res.json();

    if (data.message === "Verified") {
      dispatch(updateVerified());
      window.location.href = "/api-docs";
    } else {
      setMessage(data.error || "Invalid code");
    }
  };

  // --------------------------
  // RESEND CODE
  // --------------------------
  const resendCode = async () => {
    if (cooldown > 0) return;

    const res = await fetch("/api/auth/resend", {
      method: "POST",
      body: JSON.stringify({ email: user?.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to resend code");
      return;
    }

    setMessage("Verification code sent again!");

    // Start cooldown 20 sec
    setCooldown(20);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-4 text-center">Verify Email</h1>

      {/* status message */}
      {message && (
        <p className="text-center mb-4 text-red-500 text-sm">{message}</p>
      )}

      <input
        type="text"
        placeholder="Enter Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full mb-4 p-3 bg-gray-100 rounded"
      />

      <button
        onClick={verify}
        className="w-full py-3 bg-indigo-600 text-white rounded mb-4"
      >
        Verify
      </button>

      {/* RESEND CODE BUTTON */}
      <button
        onClick={resendCode}
        disabled={cooldown > 0}
        className={`w-full py-3 rounded text-white ${
          cooldown > 0 ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-900"
        }`}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Code"}
      </button>
    </div>
  );
}
