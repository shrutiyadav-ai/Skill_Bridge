import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;
  const userRole = token?.role as string | undefined;

  const isAuthPage = path === "/login" || path === "/register" || path === "/forgot-password";
  const isProtectedPath =
    path.startsWith("/student") ||
    path.startsWith("/industry") ||
    path.startsWith("/institution") ||
    path.startsWith("/academician") ||
    path.startsWith("/academia");

  // Helper to map role to correct dashboard path
  const getRoleDashboard = (role?: string): string => {
    switch (role) {
      case "STUDENT":
        return "/student/dashboard";
      case "INDUSTRY":
        return "/industry/dashboard";
      case "INSTITUTION":
        return "/institution/dashboard";
      case "ACADEMICIAN":
        return "/academician/dashboard";
      default:
        return "/login";
    }
  };

  // If user is already authenticated and visits login/register, redirect to their role dashboard
  if (isAuthPage) {
    if (token && userRole) {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), req.url));
    }
    return NextResponse.next();
  }

  // If path is protected and user is not authenticated
  if (isProtectedPath) {
    if (!token || !userRole) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based protection: check if user is accessing the correct role dashboard
    if (path.startsWith("/student") && userRole !== "STUDENT") {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), req.url));
    }

    if (path.startsWith("/industry") && userRole !== "INDUSTRY") {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), req.url));
    }

    if (path.startsWith("/institution") && userRole !== "INSTITUTION") {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), req.url));
    }

    if ((path.startsWith("/academician") || path.startsWith("/academia")) && userRole !== "ACADEMICIAN") {
      return NextResponse.redirect(new URL(getRoleDashboard(userRole), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/student/:path*",
    "/industry/:path*",
    "/institution/:path*",
    "/academician/:path*",
    "/academia/:path*",
  ],
};
