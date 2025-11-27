"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function VerifyRequiredPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="max-w-xl mx-auto p-6 mt-28 text-center">
      <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
      <p className="text-gray-600 mb-6">
        Hey {user?.name}, you must verify your email to access the API.
      </p>

      <a
        href="/verify"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Go to Verification Page
      </a>
    </div>
  );
}
