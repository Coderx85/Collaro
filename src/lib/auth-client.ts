import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { config } from "./config";
import type { auth } from "./auth-config";
import { ac, roles } from "./permission";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    organizationClient({
      ac,
      roles,
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
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
 * Client-side permission check utilities
 * These use checkRolePermission for synchronous checks (no server call)
 * For dynamic roles, use authClient.organization.hasPermission instead
 */

/**
 * Check if a role can update workspace (synchronous, client-side only)
 */
export function canRoleUpdateWorkspace(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["update"] },
    role,
  });
}

/**
 * Check if a role can delete workspace (synchronous, client-side only)
 */
export function canRoleDeleteWorkspace(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["delete"] },
    role,
  });
}

/**
 * Check if a role can manage members (synchronous, client-side only)
 */
export function canRoleManageMembers(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { member: ["create", "update", "delete"] },
    role,
  });
}

/**
 * Check if a role can invite members (synchronous, client-side only)
 */
export function canRoleInviteMembers(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { invitation: ["create"] },
    role,
  });
}

/**
 * Async permission check - hits the server for accurate permission check
 * Use this when you need to validate permissions before an action
 */
export async function checkPermission(
  permissions: Record<string, string[]>
): Promise<boolean> {
  try {
    const result = await authClient.organization.hasPermission({
      permissions,
    });
    return result?.data?.success ?? false;
  } catch {
    return false;
  }
}
