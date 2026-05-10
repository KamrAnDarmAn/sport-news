import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const loggedIn = !!req.auth?.user;

  if (pathname.startsWith("/auth") && loggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  const needsLogin =
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/create") ||
    pathname.startsWith("/roles") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile");

  if (needsLogin && !loggedIn) {
    const url = new URL("/auth", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/bookmarks/:path*",
    "/create/:path*",
    "/roles/:path*",
    "/auth",
    "/auth/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
