import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has("refreshToken");
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/registration";
  const isProtected = pathname === "/";

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/registration"],
};
