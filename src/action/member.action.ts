"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import type { APIResponse, OrganizationMember } from "@/types";

interface MemberResponse extends APIResponse<OrganizationMember> {}

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

  return {
    success: true,
    data: {
      id: member.id,
      userId: member.userId,
      workspaceId: workspace.id,
      role: member.role as "owner" | "admin" | "member",
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.createdAt),
    },
  };
};
