"use server";

import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import type { APIResponse, TOrganizationMember } from "@/types";
type MemberResponse = APIResponse<TOrganizationMember>;

export const getMember = async (
  workspaceSlug: string,
  userId: string,
): Promise<MemberResponse> => {
  const { data: workspace } = await authClient.organization.getFullOrganization(
    {
      fetchOptions: {
        headers: await headers(),
      },
      query: {
        organizationSlug: workspaceSlug,
      },
    },
  );

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
