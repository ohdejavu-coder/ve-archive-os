import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Reads ?lang=en from URL and sets a cookie.
 * This allows server components to know the language before rendering.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const langParam = url.searchParams.get("lang");
  const response = NextResponse.next();

  if (langParam === "en") {
    response.cookies.set("ve-lang", "en", { path: "/", maxAge: 86400 });
  } else if (langParam === "zh") {
    response.cookies.set("ve-lang", "zh", { path: "/", maxAge: 86400 });
  } else {
    // No lang param — read from existing cookie (keep it)
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|static|favicon).*)"],
};
