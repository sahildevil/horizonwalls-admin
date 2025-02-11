import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === "/login") {
      if (req.nextauth.token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
};