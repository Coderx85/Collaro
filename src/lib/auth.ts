// import "server-only";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./auth-config";

/**
 * Auth Module
 * This file provides the server-side authentication utilities using better-auth
 */

export type AuthResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    // Revoke the current session
    await auth.api.signOut({
      headers: await headers(),
    });
  }

  redirect("/sign-in");
}

/**
 * Check if email is available
 */
export async function checkEmailAvailability(email: string): Promise<boolean> {
  // This would need to be implemented via the database directly
  // or through a custom API endpoint
  // For now, return true as the signup will fail if email exists
  return true;
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(
  userName: string
): Promise<boolean> {
  // This would need to be implemented via the database directly
  // or through a custom API endpoint
  // For now, return true as the signup will fail if username exists
  return true;
}

// Re-export the auth instance for advanced use cases
export { auth } from "./auth-config";
