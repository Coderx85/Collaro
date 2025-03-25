import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { auth } from '@clerk/nextjs/server';

const protectedRoute = createRouteMatcher([
  "/workspace/:path*",
  "/meeting/:path*",
  "/meeting",
]);

const adminRoute = createRouteMatcher(["/admin/:path*", "meeting/:path*"]);

export default clerkMiddleware(async (auth, req) => {
  // const { userId } = auth();
  if (adminRoute(req)) {
    // userId.role === 'admin'
  }
  if (protectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
