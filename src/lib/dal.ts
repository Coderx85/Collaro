import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-config";

// Session type that includes verified user data
export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null | undefined;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null | undefined;
  };
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
  };
};

/**
 * Verify the session from cookies and return session data
 * Memoized with React cache to avoid duplicate calls during render pass
 */
export const verifySession = cache(async (): Promise<Session | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session as Session;
});

/**
 * Get the currently authenticated user with verification
 * Will redirect to /sign-in if not authenticated
 */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/sign-in");
  }

  return session.user;
});

/**
 * Optionally verify session without redirecting
 * Returns null if not authenticated
 */
export const verifySessionOptional = cache(
  async (): Promise<Session | null> => {
    return await verifySession();
  },
);

/**
 * Get the current session with user data
 * Throws redirect if not authenticated
 */
export const getSession = cache(async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
});
