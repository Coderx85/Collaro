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
    permissions: { organization: ["create"] },
    role,
  });
}

/**
 * Check if a role can delete an organization (synchronous, client-side only)
 */
export function canRoleDeleteOrganization(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["delete"] },
    role,
  });
}

/**
 * Check if a role can view an organization (synchronous, client-side only)
 */
export function canRoleViewOrganization(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["view"] },
    role,
  });
}

/**
 * Check if a role can update an organization (synchronous, client-side only)
 */
export function canRoleUpdateOrganization(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["update"] },
    role,
  });
}

/**
 * Deprecated: Use canRoleDeleteOrganization instead
 * @deprecated
 */
export function canRoleDeleteWorkspace(
  role: "owner" | "admin" | "member"
): boolean {
  return canRoleDeleteOrganization(role);
}

/**
 * Deprecated: Use canRoleCreateOrganization instead
 * @deprecated
 */
export function canRoleCreateWorkspace(
  role: "owner" | "admin" | "member"
): boolean {
  return canRoleCreateOrganization(role);
}

export function canRoleCreateOrganization(
  role: "owner" | "admin" | "member"
): boolean {
  return authClient.organization.checkRolePermission({
    permissions: { organization: ["create"] },
    role,
  });
}

/**
 * Deprecated: Use canRoleViewOrganization instead
 * @deprecated
 */
export function canRoleViewWorkspace(
  role: "owner" | "admin" | "member"
): boolean {
  return canRoleViewOrganization(role);
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

class Permission {
  /**
   * Synchronous permission check - client-side only
   * Use this for quick checks based on role without server calls
   */
  static checkPermissionSync(
    role: "owner" | "admin" | "member",
    permissions: Record<string, string[]>
  ): boolean {
    return authClient.organization.checkRolePermission({
      permissions,
      role,
    });
  }

  private static canRoleCreateOrganization(
    role: "owner" | "admin" | "member"
  ): boolean {
    return Permission.checkPermissionSync(role, { organization: ["create"] });
  }

  private static canRoleDeleteOrganization(
    role: "owner" | "admin" | "member"
  ): boolean {
    return Permission.checkPermissionSync(role, { organization: ["delete"] });
  }

  private static canRoleViewOrganization(
    role: "owner" | "admin" | "member"
  ): boolean {
    return Permission.checkPermissionSync(role, { organization: ["view"] });
  }

  private static canRoleUpdateOrganization(
    role: "owner" | "admin" | "member"
  ): boolean {
    return Permission.checkPermissionSync(role, { organization: ["update"] });
  }

  private static canRoleManageMembers(
    role: "owner" | "admin" | "member"
  ): boolean {
    return Permission.checkPermissionSync(role, {
      member: ["create", "update", "delete"],
    });
  }

  private static canRoleInviteMembers(
    role: "owner" | "admin" | "member"
  ): boolean {
    return Permission.checkPermissionSync(role, { invitation: ["create"] });
  }

  public static get Role() {
    return {
      canCreateOrganization: this.canRoleCreateOrganization,
      canDeleteOrganization: this.canRoleDeleteOrganization,
      canViewOrganization: this.canRoleViewOrganization,
      canUpdateOrganization: this.canRoleUpdateOrganization,
      canManageMembers: this.canRoleManageMembers,
      canInviteMembers: this.canRoleInviteMembers,
    };
  }
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
