import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------- ALLOW PUBLIC ROUTES ----------
  const PUBLIC_PATHS = [
    "/",
    "/playground",
    "/auth",
    "/verify",
    "/verify-required",
  ];

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ---------- CHECK USER LOGIN ----------
  const cookie = req.cookies.get("user");
  if (!cookie) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  let user;
  try {
    user = JSON.parse(cookie.value);
  } catch {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // ---------- BLOCK UNVERIFIED ----------
  if (!user.isVerified && pathname.startsWith("/api-docs")) {
    return NextResponse.redirect(new URL("/verify-required", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api-docs", "/api-docs/:path*"],
};
