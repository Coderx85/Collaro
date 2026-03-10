import { db } from "../db/client";
import { workspacesTable } from "../db/schema/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export async function checkWorkspaceAccess(slug: string) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/auth/login");
  }

  const workspace = await db.query.workspacesTable.findFirst({
    where: eq(workspacesTable.slug, slug),
  });

  if (!workspace) {
    notFound();
  }

  const { data: organizations } = await authClient.organization.list({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const hasAccess = organizations?.find((org) => org.id === workspace.id);

  if (!hasAccess) {
    redirect("/forbidden");
  }

  return { workspace, session };
}

/**
 * Check if user can update a workspace (owner or admin only)
 * Returns { allowed: boolean, error?: string }
 */
export async function canUpdateWorkspace(): Promise<{
  allowed: boolean;
  error?: string;
}> {
  try {
    const { data: result } = await authClient.organization.hasPermission({
      fetchOptions: {
        headers: await headers(),
      },
      permissions: {
        organization: ["update"],
      },
    });

    return { allowed: result?.success ?? false };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { allowed: false, error: "Failed to check permissions" };
  }
}

/**
 * Check if user can delete a workspace (owner only)
 * Returns { allowed: boolean, error?: string }
 */
export async function canDeleteWorkspace(): Promise<{
  allowed: boolean;
  error?: string;
}> {
  try {
    const { data: result } = await authClient.organization.hasPermission({
      fetchOptions: {
        headers: await headers(),
      },
      permissions: {
        organization: ["delete"],
      },
    });

    return { allowed: result?.success ?? false };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { allowed: false, error: "Failed to check permissions" };
  }
}

/**
 * Check if user can manage members (owner or admin)
 * This includes inviting, updating roles, and removing members
 */
export async function canManageMembers(): Promise<{
  allowed: boolean;
  error?: string;
}> {
  try {
    const { data: result } = await authClient.organization.hasPermission({
      fetchOptions: {
        headers: await headers(),
      },
      permissions: {
        member: ["create", "update", "delete"],
      },
    });

    return { allowed: result?.success ?? false };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { allowed: false, error: "Failed to check permissions" };
  }
}

/**
 * Check if user can invite members
 */
export async function canInviteMembers(): Promise<{
  allowed: boolean;
  error?: string;
}> {
  try {
    const { data: result } = await authClient.organization.hasPermission({
      fetchOptions: {
        headers: await headers(),
      },
      permissions: {
        invitation: ["create"],
      },
    });

    return { allowed: result?.success ?? false };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { allowed: false, error: "Failed to check permissions" };
  }
}

/**
 * Get user's role in the current active organization
 */
export async function getCurrentUserRole(): Promise<string | null> {
  try {
    const { data: members } = await authClient.organization.listMembers({
      fetchOptions: {
        headers: await headers(),
      },
    });

    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });

    if (!session || !session.user || !members) {
      return null;
    }

    const member = members.members.find(
      (member) => member.userId === session.user.id,
    );

    const res = member?.role ?? null;
    return res;
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
}

/**
 * Check if user is the owner of the current workspace
 */
export async function isWorkspaceOwner(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === "owner";
}

/**
 * Check if user is an admin of the current workspace
 */
export async function isWorkspaceAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === "admin" || role === "owner";
}
