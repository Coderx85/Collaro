"use server";

import { db } from "@/db/client";
import { workspacesTable, membersTable, usersTable } from "@/db/schema/schema";
import type { APIResponse, UserResponse } from "@/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// Helper to get current authenticated user
async function getCurrentAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
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

    return { data: result.user, success: true };
  } catch (error) {
    console.error("Login Action Error:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: message, success: false };
  }
}

// export async function checkUserWorkspaceId() {
//   const authUser = await getCurrentAuthUser();
//   if (!authUser) throw redirect("/sign-in");

//   // Check if user has any workspace membership
//   const [membership] = await db
//     .select()
//     .from(membersTable)
//     .where(eq(membersTable.userId, authUser.id))
//     .limit(1)
//     .execute();

//   if (membership?.workspaceId) {
//     redirect(`/workspace/${membership.workspaceId}`);
//   }

//   return null;
// }

export async function getUserWorkspaceId() {
  const authUser = await getCurrentAuthUser();
  if (!authUser) throw redirect("/sign-in");

  // Get user's first workspace membership
  const [membership] = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.userId, authUser.id))
    .limit(1)
    .execute();

  if (!membership?.workspaceId) {
    console.log("Workspace ID is null");
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
    const authUser = await getCurrentAuthUser();
    if (!authUser) return redirect("/sign-in");

    // Get user from the better-auth user table
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, authUser.id))
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
