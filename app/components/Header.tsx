"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../features/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link href="/" className="text-xl font-bold">
        JSON Converter
      </Link>

      <nav className="flex items-center gap-6">
        {/* Always show Playground */}
        <Link href="/playground" className="hover:underline">
          Playground
        </Link>

        {/* NOT LOGGED IN */}
        {!user && (
          <Link href="/auth" className="hover:underline">
            Sign In
          </Link>
        )}

        {/* LOGGED IN BUT NOT VERIFIED */}
        {user && !user.isVerified && (
          <Link
            href="/verify"
            className="text-yellow-600 font-medium hover:underline"
          >
            Verify Email
          </Link>
        )}

        {/* LOGGED IN AND VERIFIED → Show API Docs */}
        {user && user.isVerified && (
          <Link href="/api-docs" className="hover:underline">
            API Docs
          </Link>
        )}

        {/* USER NAME + LOGOUT */}
        {user && (
          <>
            <span className="font-medium text-gray-700">{user.name}</span>

            <button
              onClick={() => {
                dispatch(logout());
                window.location.href = "/";
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
