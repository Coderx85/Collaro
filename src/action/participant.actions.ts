"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth-server";
import { db } from "@/db/client";
import { membersTable, usersTable } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import type { APIResponse, TUserId, TUserRole, TWorkspaceId } from "@/types";
import { IWorkspaceDTO } from "@/modules/workspace";
import { tryCatchAction } from "@/lib/try-catch-wrapper";
import { IParticipantDTO, participantStore } from "@/modules/meeting";

export type ParticipantRole = TUserRole;

interface ParticipantRoleResponse {
  role: ParticipantRole;
  userId: string;
  userName: string;
  name: string;
  email: string;
}

type RoleResponse = APIResponse<ParticipantRoleResponse>;

/**
 * Get participant role in a workspace
 * Used for displaying role badges in video calls
 */
export const getParticipantRole = async (
  userId: TUserId,
  slug: IWorkspaceDTO["slug"],
): Promise<RoleResponse> => {
  try {
    // First try using Better Auth (faster)
    const workspace = await auth.api.getFullOrganization({
      query: {
        organizationSlug: slug,
      },
      headers: await headers(),
    });

    if (workspace) {
      const member = workspace.members?.find(
        (m) => m.userId === String(userId),
      );

      if (member) {
        return {
          success: true,
          data: {
            role: member.role as ParticipantRole,
            userId: member.userId,
            userName: member.userId, // Better Auth might not have userName
            name: member.userId, // Fallback, will be overridden by DB query if needed
            email: "", // Not available in Better Auth member
          },
        };
      }
    }

    // Fallback: Query database directly
    const result = await db
      .select({
        role: membersTable.role,
        userId: usersTable.id,
        userName: usersTable.userName,
        name: usersTable.name,
        email: usersTable.email,
      })
      .from(membersTable)
      .innerJoin(usersTable, eq(membersTable.userId, usersTable.id))
      .where(
        and(
          eq(membersTable.userId, userId),
          eq(
            membersTable.workspaceId,
            workspace?.id as unknown as TWorkspaceId,
          ),
        ),
      )
      .limit(1);

    if (result.length === 0) {
      return {
        success: false,
        error: "Participant not found in workspace",
      };
    }

    const data = result[0];
    return {
      success: true,
      data: {
        role: data.role as ParticipantRole,
        userId: String(data.userId),
        userName: data.userName,
        name: data.name,
        email: data.email,
      },
    };
  } catch (error) {
    console.error("Error fetching participant role:", error);
    return {
      success: false,
      error: "Failed to fetch participant role",
    };
  }
};

/**
 * Get multiple participant roles at once (batch operation)
 */
export const getParticipantRoles = async (
  userIds: TUserId[],
  workspaceId: TWorkspaceId,
): Promise<APIResponse<ParticipantRoleResponse[]>> => {
  try {
    const results = await db
      .select({
        role: membersTable.role,
        userId: usersTable.id,
        userName: usersTable.userName,
        name: usersTable.name,
        email: usersTable.email,
      })
      .from(membersTable)
      .innerJoin(usersTable, eq(membersTable.userId, usersTable.id))
      .where(
        and(
          eq(membersTable.workspaceId, workspaceId),
          // Filter by userIds array
          userIds.length > 0 ? eq(membersTable.userId, userIds[0]) : undefined,
        ),
      );

    return {
      success: true,
      data: results.map((r) => ({
        role: r.role as ParticipantRole,
        userId: String(r.userId),
        userName: r.userName,
        name: r.name,
        email: r.email,
      })),
    };
  } catch (error) {
    console.error("Error fetching participant roles:", error);
    return {
      success: false,
      error: "Failed to fetch participant roles",
    };
  }
};