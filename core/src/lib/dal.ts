import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth-server";
import { TUserId } from "@/types";

// Session type that includes verified user data
export type Session = {
  user: {
    id: TUserId;
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
    userId: TUserId;
  };
};

/**
 * Get the currently authenticated user with verification
 * Will redirect to /sign-in if not authenticated
 */
export const getCurrentUser: () => Promise<Session["user"]> = cache(
  async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/sign-in");
    }

    return {
      id: session.user.id as unknown as TUserId,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image,
      updatedAt: session.user.updatedAt,
      createdAt: session.user.createdAt,
      userName: session.user.userName,
    };
  },
);