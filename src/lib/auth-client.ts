import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { config } from "./config";
import type { auth } from "./auth-config";

export const authClient = createAuthClient({
  // Base URL is inferred from the current domain when running in browser
  // If you need to specify a custom base URL, uncomment the line below
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  baseURL: config.betterAuthUrl,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});

// Export individual methods for convenience
export const { signIn, signUp, signOut, useSession, getSession } = authClient;

// Type exports
export type AuthSession = typeof authClient.$Infer.Session;
