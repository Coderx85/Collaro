import { auth } from "./lib/auth-config";
import { config as appConfig } from "@/lib/config";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/workspace", "/meeting"];
const authRoutes = [appConfig.SIGN_IN, appConfig.SIGN_UP];
const publicRoutes = ["/"];

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow API routes through without middleware processing
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is public auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if route is explicitly public
  const isPublicRoute = publicRoutes.includes(pathname);

  // If public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Redirect to workspace if authenticated user tries to access auth routes
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
