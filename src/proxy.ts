import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth-config";
import { headers } from "next/headers";
import { config as appConfig } from "@/lib/config";

const protectedRoute = ["/workspace/:path*", "/meeting/:path*"];

export default async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return NextResponse.redirect(new URL(appConfig.SIGN_IN, req.url));
  }

  const isProtectedRoute = protectedRoute.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
