"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth-config";
import type { APIResponse, TInviteMemberRole, TOrganizationMember, TUserRole } from "@/types";
import { db } from "@/db";
import { createMemberSchema } from "@/db/schema/type";
import { membersTable } from "@/db/schema/schema";
import z from "zod";
import { getWorkspaceBySlug } from "./workspace/get-workspace.actions";
import { getWorkspaceById } from "./workspace";
type MemberResponse = APIResponse<TOrganizationMember>;

type CreateMemberDTO = z.infer<typeof createMemberSchema>;

export const getMember = async (
  workspaceSlug: string,
  userId: string,
): Promise<MemberResponse> => {
  const workspace = await auth.api.getFullOrganization({
    query: {
      organizationSlug: workspaceSlug,
    },
    headers: await headers(),
  });

  if (!workspace) {
    return {
      success: false,
      error: "Workspace not found",
    };
  }

  // Find the member from the workspace's members array
  const member = workspace.members?.find((m) => m.userId === userId);

  if (!member) {
    return {
      success: false,
      error: "Member not found in workspace",
    };
  }

  const validRoles = ["owner", "admin", "member"] as const;
  const role = validRoles.includes(member.role as any) ? (member.role as "owner" | "admin" | "member") : "member";

  return {
    success: true,
    data: {
      id: member.id,
      userId: member.userId,
      workspaceId: workspace.id,
      role,
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.createdAt),
    },
  };
};

export const addMember = async (
  input: { userId: string; workspaceId: string, role: Omit<TUserRole, "owner"> }
): Promise<APIResponse<CreateMemberDTO>> => {
  try {
    const workspace = await getWorkspaceById(input.workspaceId);

    if (!workspace || !workspace.success || !workspace.data) {
      return { success: false, error: "Workspace not exsist" };
    }

    const [result] = await db
      .insert(membersTable)
      .values({
        userId: input.userId,
        workspaceId: workspace.data.id,
        role: input.role as TInviteMemberRole,
        createdAt: new Date(),
      })
      .returning()
      .execute();

    if (!result) {
      throw new Error("Failed to add member");
    }

    return {
      success: true,
      data: {
        id: result.id,
        userId: result.userId,
        workspaceId: result.workspaceId,
        role: input.role as TInviteMemberRole,
        createdAt: result.createdAt,
      },
    };
      
  } catch (error: unknown) {
    throw new Error(`Failed to add member: ${error instanceof Error ? error.message : String(error)}`);
  }
}