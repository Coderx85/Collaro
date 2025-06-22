import {
  clerkMiddleware,
  // createRouteMatcher
} from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Previously commented out route protection - these would be used for protecting specific routes
// const protectedRoute = createRouteMatcher([
//   "/workspace/:path*",
//   "/meeting",
// ]);

// Admin route protection - currently disabled
// const isAdminRoute = createRouteMatcher(["/admin/:path*"]);

// Configuration for the application's protocol and domain
// Uses environment variable for production, falls back to localhost for development
export const protocol = "http";
export const rootDomain = process.env.NEXT_PUBLIC_BASE_URL || "localhost:3000";

/**
 * Extracts subdomain from the incoming request
 * Handles both local development and production environments
 *
 * @param request - The incoming NextRequest object
 * @returns string | null - The extracted subdomain or null if no subdomain found
 */
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0]; // Remove port number if present

  // Local development environment handling
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL (e.g., http://tenant.localhost:3000)
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach for subdomain detection
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    // No subdomain found in local environment
    return null;
  }

  // Production environment handling
  const rootDomainFormatted = rootDomain.split(":")[0]; // Remove port if present

  // Handle Vercel preview deployment URLs with format: tenant---branch-name.vercel.app
  // This allows subdomains to work in Vercel preview deployments
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection for production
  // Check if hostname is a subdomain of the root domain
  const isSubdomain =
    hostname !== rootDomainFormatted && // Not the root domain
    hostname !== `www.${rootDomainFormatted}` && // Not the www version
    hostname.endsWith(`.${rootDomainFormatted}`); // Ends with the root domain

  // Extract subdomain by removing the root domain part
  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

/**
 * Main middleware function that handles subdomain routing
 * Uses Clerk for authentication and implements subdomain-based multi-tenancy
 */
export default clerkMiddleware(async (auth, req) => {
  // Rate limiting with Arcjet - currently commented out
  // const check = await aj.protect(req);
  // if (check.isDenied()) {
  //   return NextResponse.json("Rate limit exceeded", { status: 403 });
  // }

  // Admin route protection - currently disabled
  // if (
  //   isAdminRoute(req) &&
  //   (await auth()).sessionClaims?.metadata?.role !== "admin"
  // ) {
  //   const url = new URL("/", req.url);
  //   return NextResponse.redirect(url);
  // }

  // Protected route authentication - currently disabled
  // if (protectedRoute(req)) await auth.protect();
  // return NextResponse.next();

  // Extract subdomain from the current request
  const subdomain = extractSubdomain(req);

  // If a subdomain is detected, rewrite the URL to the subdomain route
  // This internally routes subdomain.example.com to /s/subdomain
  // enabling multi-tenant functionality where each subdomain represents a different organization
  if (subdomain) {
    return NextResponse.rewrite(new URL(`/s/${subdomain}`, req.url));
  }

  // If no subdomain is detected, allow normal access to the root domain
  // The request continues to be processed normally
});

/**
 * Middleware configuration
 * Defines which routes this middleware should run on
 *
 * - Excludes static files (files with extensions)
 * - Excludes Next.js internal routes (_next)
 * - Includes API and tRPC routes
 * - Includes all other dynamic routes
 */
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
