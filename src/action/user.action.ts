"use server";

import { db } from "@/db/client";
import { workspacesTable, membersTable, usersTable } from "@/db/schema/schema";
import type { APIResponse, UserResponse } from "@/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";

// Helper to get current authenticated user
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(config.SIGN_IN);
  }
  const dbUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, session.user.id),
  });

  if (!dbUser) {
    redirect(config.SIGN_IN);
  }

  return {
    ...session,
    user: dbUser,
  };
}

export async function loginAction(email: string, password: string) {
  try {
    // Use the server-side API for authentication
    // Note: Do NOT hash the password - better-auth handles password hashing internally
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(), // Crucial for setting cookies in Server Actions
    });

    if (!result) {
      return { error: "Invalid email or password", success: false };
    }

    // Use the session token from the login result for subsequent API calls
    // since the cookie isn't available in the original request headers yet
    const sessionToken = result.token;
    const authHeaders = {
      cookie: `better-auth.session_token=${sessionToken}`,
      origin: config.betterAuthUrl,
    };

    // Check workspaces
    const data = await auth.api.listOrganizations({
      headers: authHeaders,
    });

    if (data.length > 0) {
      await auth.api.setActiveOrganization({
        body: {
          organizationId: data[0].id,
        },
        headers: authHeaders,
      });
    }

    return { data: result.user, success: true };
  } catch (error: unknown) {
    let message = "An unknown error occurred";

    if (error && typeof error === "object") {
      const errObj = error as Record<string, unknown>;
      if (errObj.status === "UNAUTHORIZED") {
        message = "Invalid email or password";
      } else if (
        typeof errObj.message === "string" &&
        errObj.message.length > 0
      ) {
        message = errObj.message;
      } else if (typeof errObj.status === "string") {
        message = `Authentication failed: ${errObj.status}`;
      }
    } else if (error instanceof Error && error.message) {
      message = error.message;
    }

    return { error: message, success: false };
  }
}

export async function getUserWorkspaceId() {
  const authUser = await getCurrentUser();

  // Get user's first workspace membership
  const [membership] = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.userId, authUser.user.id))
    .limit(1)
    .execute();

  if (!membership?.workspaceId) {
    return { error: "Workspace ID is null", success: false };
  }

  return {
    data: {
      workspaceId: membership.workspaceId,
    },
    success: true,
  };
}

export async function getUser(): Promise<APIResponse<UserResponse>> {
  try {
    const authUser = await getCurrentUser();

    // Get user from the better-auth user table
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, authUser.user.id))
      .execute();

    if (!user) return { error: "User does not exist", success: false };

    return { data: user as UserResponse, success: true };
  } catch (error: unknown) {
    return { error: `Failed to get user:: \n ${error}`, success: false };
  }
}

export async function getAllUsers(): Promise<APIResponse<UserResponse[]>> {
  try {
    const data = await db.select().from(usersTable).execute();
    return { data: data as UserResponse[], success: true };
  } catch (error: unknown) {
    return { error: `Failed to get all users:: \n ${error}`, success: false };
  }
}
