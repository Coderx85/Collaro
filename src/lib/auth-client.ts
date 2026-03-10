import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { config } from "./config";
import type { auth } from "./auth-config";
// import { ac, roles } from "./permission";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields<typeof auth>(),
    organizationClient({
      // ac,
      // roles,
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
  basePath: "/auth",
});

// Export individual methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  useListOrganizations,
  useActiveOrganization,
} = authClient;

// Type exports
export type AuthSession = typeof authClient.$Infer.Session;

/**
 * Check if a role can delete an organization (synchronous, client-side only)
 */
export function canRoleDeleteOrganization(
  role: "owner" | "admin" | "member" | undefined,
): boolean {
  const validRoles = ["owner", "admin", "member"];
  if (!role || !validRoles.includes(role)) return false;
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["delete"] },
    role,
  });
}

/**
 * Check if a role can update an organization (synchronous, client-side only)
 */
export function canRoleUpdateOrganization(
  role: "owner" | "admin" | "member" | undefined,
): boolean {
  const validRoles = ["owner", "admin", "member"];
  if (!role || !validRoles.includes(role)) return false;
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["update"] },
    role,
  });
}