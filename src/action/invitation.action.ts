"use server";

import { db } from "@/db/client";
import {
  invitationTable,
  membersTable,
  usersTable,
  workspacesTable,
} from "@/db/schema/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { and, eq, gt } from "drizzle-orm";
import { inngest } from "@/lib/inngest";
import type { APIResponse } from "@/types/api";
import { getWorkspace } from "./workspace.action";
import { getCurrentUser } from "./user.action";

interface CreateInvitationParams {
  workspaceId: string;
  workspaceSlug: string;
  email: string;
  role: "admin" | "member";
}

interface InvitationData {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: Date;
}

/**
 * Create an invitation and send email
 * Only workspace owners can invite new members
 */
export async function createInvitation({
  workspaceId,
  workspaceSlug,
  email,
  role,
}: CreateInvitationParams): Promise<APIResponse<InvitationData>> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return { success: false, error: "Not authenticated" };
    }

    const invitation = await auth.api.createInvitation({
      body: {
        organizationId: workspaceId,
        email,
        role,
        resend: true,
      },
      headers: await headers(),
    });

    // Get workspace name
    const [workspace] = await db
      .select({ name: workspacesTable.name })
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .execute();

    const workspaceName = workspace?.name || "Unknown Workspace";

    // Generate invite URL
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/accept-invite/${invitation.id}?workspaceSlug=${workspaceSlug}&workspaceId=${workspaceId}`;

    // Send invitation email via Inngest background job
    try {
      await inngest.send({
        name: "app/invite.send",
        data: {
          email,
          workspaceName,
          workspaceSlug,
          workspaceId,
          inviterName: authUser.user.name || authUser.user.email || "Someone",
          inviteUrl,
          role,
        },
      });
    } catch (error) {
      console.error("Failed to send invite email event:", error);
      // Delete the invitation if event sending failed
      await db
        .delete(invitationTable)
        .where(eq(invitationTable.id, invitation.id));
      return {
        success: false,
        error: "Failed to send invitation email",
      };
    }

    return {
      success: true,
      data: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      },
    };
  } catch (error) {
    console.error("Error creating invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invitation",
    };
  }
}

/**
 * Get all pending invitations for a workspace
 */
export async function getPendingInvitations(
  workspaceId: string
): Promise<APIResponse<InvitationData[]>> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user is member of this workspace
    const userRole = await getWorkspace(workspaceId);
    if (!userRole) {
      return { success: false, error: "Not a member of this workspace" };
    }

    const invitations = await db
      .select()
      .from(invitationTable)
      .where(
        and(
          eq(invitationTable.workspaceId, workspaceId),
          eq(invitationTable.status, "pending"),
          gt(invitationTable.expiresAt, new Date())
        )
      )
      .execute();

    return {
      success: true,
      data: invitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        status: inv.status,
        expiresAt: inv.expiresAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch invitations",
    };
  }
}

/**
 * Cancel a pending invitation
 * Only workspace owners can cancel invitations
 */
export async function cancelInvitation(
  invitationId: string
): Promise<APIResponse<{ cancelled: boolean }>> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the invitation
    const [invitation] = await db
      .select()
      .from(invitationTable)
      .where(eq(invitationTable.id, invitationId))
      .execute();

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    // Check if user is owner of this workspace
    const { data } = await getWorkspace(invitation.workspaceId);
    if (!data) {
      return { success: false, error: "Workspace not found" };
    }

    if (data.member.role !== "owner") {
      return { success: false, error: "Only owners can cancel invitations" };
    }

    await db
      .delete(invitationTable)
      .where(eq(invitationTable.id, invitationId));

    return { success: true, data: { cancelled: true } };
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to cancel invitation",
    };
  }
}

/**
 * Get invitation details by ID (for accept invite page)
 */
export async function getInvitationById(invitationId: string): Promise<
  APIResponse<{
    id: string;
    email: string;
    role: string;
    status: string;
    expiresAt: Date;
    workspaceName: string;
    workspaceSlug: string;
    inviterName: string;
    isExpired: boolean;
  }>
> {
  try {
    const [invitation] = await db
      .select({
        id: invitationTable.id,
        email: invitationTable.email,
        role: invitationTable.role,
        status: invitationTable.status,
        expiresAt: invitationTable.expiresAt,
        workspaceId: invitationTable.workspaceId,
        inviterId: invitationTable.inviterId,
      })
      .from(invitationTable)
      .where(eq(invitationTable.id, invitationId))
      .execute();

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    // Get workspace details
    const [workspace] = await db
      .select({ name: workspacesTable.name, slug: workspacesTable.slug })
      .from(workspacesTable)
      .where(eq(workspacesTable.id, invitation.workspaceId))
      .execute();

    // Get inviter details
    const [inviter] = await db
      .select({ name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, invitation.inviterId))
      .execute();

    const isExpired = invitation.expiresAt < new Date();

    return {
      success: true,
      data: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        workspaceName: workspace?.name || "Unknown Workspace",
        workspaceSlug: workspace?.slug || "",
        inviterName: inviter?.name || "Someone",
        isExpired,
      },
    };
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch invitation",
    };
  }
}

/**
 * Accept an invitation
 * Adds the current user to the workspace and marks invitation as accepted
 */
export async function acceptInvitation(
  invitationId: string
): Promise<APIResponse<{ workspaceSlug: string }>> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the invitation
    const [invitation] = await db
      .select()
      .from(invitationTable)
      .where(eq(invitationTable.id, invitationId))
      .execute();

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      return { success: false, error: "Invitation has already been used" };
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      return { success: false, error: "Invitation has expired" };
    }

    // Check if user email matches invitation email
    if (authUser.user.email !== invitation.email) {
      return {
        success: false,
        error: "This invitation was sent to a different email address",
      };
    }

    // Check if user is already a member
    const [existingMember] = await db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.userId, authUser.user.id),
          eq(membersTable.workspaceId, invitation.workspaceId)
        )
      )
      .execute();

    if (existingMember) {
      // Update invitation status
      await db
        .update(invitationTable)
        .set({ status: "accepted" })
        .where(eq(invitationTable.id, invitationId));

      // Get workspace slug
      const [workspace] = await db
        .select({ slug: workspacesTable.slug })
        .from(workspacesTable)
        .where(eq(workspacesTable.id, invitation.workspaceId))
        .execute();

      return {
        success: true,
        data: { workspaceSlug: workspace?.slug || "" },
      };
    }

    // Add user to workspace
    await db.insert(membersTable).values({
      userId: authUser.user.id,
      workspaceId: invitation.workspaceId,
      role: invitation.role as "admin" | "member",
    });

    // Update invitation status
    await db
      .update(invitationTable)
      .set({ status: "accepted" })
      .where(eq(invitationTable.id, invitationId));

    // Get workspace slug
    const [workspace] = await db
      .select({ slug: workspacesTable.slug })
      .from(workspacesTable)
      .where(eq(workspacesTable.id, invitation.workspaceId))
      .execute();

    return {
      success: true,
      data: { workspaceSlug: workspace?.slug || "" },
    };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to accept invitation",
    };
  }
}
