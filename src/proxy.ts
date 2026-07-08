import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy — request-level gate for language & CCR auth.
 * Replaces middleware.ts (deprecated in Next.js 16).
 *
 * Set CCR_PASSWORD in your environment variables (or .env file locally).
 */

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const response = NextResponse.next();

  // --- Language switching ---
  const langParam = url.searchParams.get("lang");
  if (langParam === "en") {
    response.cookies.set("ve-lang", "en", { path: "/", maxAge: 86400 });
  } else if (langParam === "zh") {
    response.cookies.set("ve-lang", "zh", { path: "/", maxAge: 86400 });
  }

  // --- CCR auth gate ---
  const authToken = request.cookies.get("ve-ccr-auth")?.value;
  const configuredPassword = process.env.CCR_PASSWORD;
  // Allow access if password is configured and matches, or fall back to empty (open)
  const isProtected = !!configuredPassword;
  const isValidAuth = !isProtected || authToken === configuredPassword;

  if (url.pathname.startsWith("/ccr") && url.pathname !== "/ccr/login") {
    if (!isValidAuth) {
      const loginUrl = new URL("/ccr/login", request.url);
      if (authToken) loginUrl.searchParams.set("error", "1");
      return NextResponse.redirect(loginUrl);
    }
  }

  if (url.pathname === "/ccr/login" && isValidAuth) {
    return NextResponse.redirect(new URL("/ccr", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|static|favicon|media).*)"],
};
