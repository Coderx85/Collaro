"use server";

import type { APIResponse, TUserId, UserResponse } from "@/types";
import { headers } from "next/headers";
import { auth, Session } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import type { RegisterFormValues } from "@/types";

type TSession = Session["session"];

interface GetCurrentUserResponse extends TSession {
  user: {
    id: TUserId;
    name: string;
    email: string;
    userName: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date | null;
  }
}

// Helper to get current authenticated user
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No active session found");
  }

  if (!session?.user) {
    redirect(config.SIGN_IN);
  }

  const userId = session.user.id as unknown as TUserId;

  return {
    ...session.session,
    user: {
      id: userId,
      name: session.user.name,
      email: session.user.email,
      userName: session.user.userName || "",
      emailVerified: session.user.emailVerified,
      createdAt: new Date(session.user.createdAt),
      updatedAt: session.user.updatedAt ? new Date(session.user.updatedAt) : null,
    },
  };
}

export async function signUpAction({
  name,
  email,
  password,
  userName,
}: RegisterFormValues): Promise<APIResponse<{ user: UserResponse }>> {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        userName,
        password,
      },
      headers: await headers(),
    });

    if (!result || !result.user) {
      return { error: "Sign up failed", success: false };
    }

    return { data: { user: result.user as unknown as UserResponse }, success: true };
  } catch (error: unknown) {
    return { error: `Sign up failed: ${error}`, success: false };
  }
}

export async function loginAction(email: string, password: string): Promise<APIResponse<{message: string}>> {
  try {
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

    return {
      data: { message: "Login successful" },
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return { error: errorMessage, success: false };
  }
}