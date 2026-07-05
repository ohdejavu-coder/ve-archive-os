import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — HTTP layer.
 * Language: reads ?lang= from URL, sets ve-lang cookie.
 * Content edits: reads ve-json cookie, makes it available server-side.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const langParam = url.searchParams.get("lang");
  const response = NextResponse.next();

  // Language switching
  if (langParam === "en") {
    response.cookies.set("ve-lang", "en", { path: "/", maxAge: 86400 });
  } else if (langParam === "zh") {
    response.cookies.set("ve-lang", "zh", { path: "/", maxAge: 86400 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|static|favicon).*)"],
};
