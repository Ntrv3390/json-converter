"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------------------------
  // SIGN UP
  // -------------------------------------
  const handleSignup = async () => {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Signup failed");
      return;
    }

    setMsg("Signup successful. Verification email sent.");
    setMode("signin");
  };

  // -------------------------------------
  // SIGN IN
  // -------------------------------------
  const handleSignin = async () => {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Login failed");
      return;
    }

    dispatch(setUser(data.user));
    window.location.href = "/";
  };

  // -------------------------------------
  // UI
  // -------------------------------------
  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white shadow p-6 rounded-lg">
        
        <div className="flex justify-between mb-6">
          <button
            className={`w-1/2 py-2 border-b-2 ${
              mode === "signin" ? "border-indigo-600" : "border-gray-300"
            }`}
            onClick={() => {
              setMode("signin");
              setMsg("");
            }}
          >
            Sign In
          </button>

          <button
            className={`w-1/2 py-2 border-b-2 ${
              mode === "signup" ? "border-indigo-600" : "border-gray-300"
            }`}
            onClick={() => {
              setMode("signup");
              setMsg("");
            }}
          >
            Sign Up
          </button>
        </div>

        {msg && <p className="mb-4 text-center text-sm text-red-500">{msg}</p>}

        {/* SIGN IN FORM */}
        {mode === "signin" && (
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded"
            />

            {/* PASSWORD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-3 bg-gray-100 rounded"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? (
                  /* Eye Open SVG */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Eye Closed SVG */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.65 21.65 0 015.17-6.73M9.88 4.12A10.94 10.94 0 0112 4c7 0 11 8 11 8a20.97 20.97 0 01-3.2 4.9" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </span>
            </div>

            <button
              onClick={handleSignin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded disabled:bg-indigo-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        )}

        {/* SIGN UP FORM */}
        {mode === "signup" && (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded"
            />

            {/* PASSWORD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-3 bg-gray-100 rounded"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? (
                  /* Eye icon open */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Eye icon closed */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.65 21.65 0 015.17-6.73M9.88 4.12A10.94 10.94 0 0112 4c7 0 11 8 11 8a20.97 20.97 0 01-3.2 4.9" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </span>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded disabled:bg-indigo-300"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
