"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth-server";
import type { APIResponse, TOrganizationMember, TUserId } from "@/types";
import { IMemberDTO, workspaceMemberManager } from "@/modules/member";
import tryCatch from "@/lib/try-catch-wrapper";
import { getCurrentUser } from "../user.actions";

type MemberResponse = APIResponse<TOrganizationMember>;

export const getMemberByIdAndSlug = async (
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

  return {
    success: true,
    data: {
      id: member.id,
      userId: member.userId,
      workspaceId: workspace.id,
      role: member.role,
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.createdAt),
    },
  };
};

export const getCurrentMemberRole = async (workspaceSlug: string): Promise<APIResponse<IMemberDTO["role"] | null>> => {
  const session = await getCurrentUser();
  const authId = session?.user?.id as unknown as TUserId;

  try {
    const role = await workspaceMemberManager.getMemberRole(workspaceSlug, authId);

    return {
      success: true,
      data: role,
    };

  }
  catch (error) {
    return {
      success: false,
      error: "Failed to fetch member role",
    };
  }
}