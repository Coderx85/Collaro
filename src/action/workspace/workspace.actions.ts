"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { canDeleteWorkspace } from "@/lib/workspace-auth";
import { getCurrentUser } from "@/lib/session";
import type { APIResponse } from "@/types/api";
import type { z } from "zod";
import { NewWorkspaceFormSchema, type TUserRole } from "@/types";
import { IMemberDTO, workspaceMemberManager } from "@/modules/member";
import { IWorkspaceDTO, TWorkspaceId } from "@/modules/workspace";
import { workspaceMeetingManager } from "@/modules/manager";
import { TUserId, TMemberId } from "@/types";
import { role } from "better-auth/plugins";

type NewWorkspaceFormSchemaType = z.infer<typeof NewWorkspaceFormSchema>;

type TFullWorkspaceDetail = IWorkspaceDTO & {
  ownerDetail: IMemberDTO,
  members: IMemberDTO[]
}

/**
 * Create a new workspace
 * Only authenticated users can create workspaces
 * @param workspaceData 
 * @returns APIResponse with workspace details or error message
 * @requires authentication
 */
export async function createWorkspace(
  workspaceData: NewWorkspaceFormSchemaType,
): Promise<APIResponse<IWorkspaceDTO>> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      redirect("/sign-in");
    }

    const workspace = await workspaceMemberManager.createWorkspace({
      name: workspaceData.name,
      slug: workspaceData.slug,
      logoUrl: workspaceData.logo || "",
      ownerId: user.id as unknown as TUserId,
      description: "",
    })

    if (!workspace) {
      return {
        success: false,
        error: "Failed to create workspace",
      };
    }

    return {
      success: true,
      data: {
        name: workspaceData.name,
        slug: workspaceData.slug,
        logoUrl: workspaceData.logo || "",
        ownerId: workspace.ownerId,
        description: "",
        id: workspace.id,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to create workspace: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Update a workspace's details
 * Only owners and admins can update workspaces
 * @param workspaceId - ID of the workspace to update
 * @param data - Object containing the updated workspace details (name, slug, logo)
 * @returns APIResponse with updated workspace details or error message
 * @requires authentication and appropriate permissions
 * @permission Only workspace owners and admins can update workspace details
 */
export async function updateWorkspace(
  workspaceId: string,
  data: { name?: string; slug?: string; logo?: string },
): Promise<APIResponse<{ name: string; slug: string; logo: string }>> {
  try {
    // Use better-auth's API to update the organization
    const result = await auth.api.updateOrganization({
      headers: await headers(),
      body: {
        organizationId: workspaceId,
        data: {
          name: data.name,
          slug: data.slug,
        },
      },
    });

    if (!result) {
      return {
        error: "Failed to update workspace",
        success: false,
      };
    }

    return {
      success: true,
      data: {
        logo: data.logo || "",
        name: result.name,
        slug: result.slug,
      },
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      error: `Failed to update workspace: ${message}`,
      success: false,
    };
  }
}

// Helper to get current authenticated user
export async function getCurrentAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

// This function is used to get the users of a workspace
export async function getWorkspaceUsers(slug: IWorkspaceDTO["slug"]): Promise<APIResponse<{ member: IMemberDTO }[]>> {
  try {
    const workspace = await workspaceMemberManager.findWorkspaceBySlug(slug);
    if (!workspace) {
      return {
        error: "Workspace not found",
        success: false,
      };
    }

    const members = await workspaceMemberManager.listMembers(workspace.id);

    const result: { member: IMemberDTO }[] = members.map((member) => ({
      member: {
        id: member.id,
        name: member.name,
        userId: member.userId,
        workspaceId: member.workspaceId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to get workspace users: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function validateWorkspaceAccess(workspaceId: TWorkspaceId, memberId: TMemberId) {
  try {
    const acess = workspaceMemberManager.validateMember(workspaceId, memberId);
 
    if (!acess) {
      throw new Error("Access denied: User does not belong to this workspace.");
    }
    
    return acess;
  } catch (error: unknown) {
    throw new Error(`Failed to validate workspace access: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/*
 * `workspaceSlug` - slug of the workspace.
 * `authUser` - authenticated user.
 * This function is used to get the workspace details with members.
 */
export async function getWorkspace(workspaceSlug: string) {
  try {
    const res = await auth.api.checkOrganizationSlug({
      headers: await headers(),
      body: {
        slug: workspaceSlug,
      }
    })

    if (!res || !res.status) {
      return { message: "Workspace not found", success: false };
    }

    const workspaceData = await auth.api.getFullOrganization({
      headers: await headers(),
      query: {
        organizationSlug: workspaceSlug,
      }
    });

    const data = {
      ...workspaceData,
      members: workspaceData?.members.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
      })),
    };
    
    return { data, success: true };
  } catch (error: unknown) {
    return { error: `Failed to get workspace:: \n ${error}`, success: false };
  }
}

// This function is used to get all workspaces
export async function getAllWorkspaces(): Promise<APIResponse<IWorkspaceDTO[] | null>> {
  const user = await getCurrentUser();

  if(!user) {
    return {
      error: "User not authenticated",
      success: false,
    }
  }

  const workspaces = await workspaceMemberManager.listUserWorkspaces(user?.id as unknown as TUserId);

  if (!workspaces) {
    return {
      error: "Failed to fetch workspaces for the user",
      success: false,
    };
  }

  if (workspaces.length === 0) {
    return {
      data: [],
      success: true,
    };
  }

  const dto: IWorkspaceDTO[] = workspaces.map((w) => ({
    id: w.id,
    createdAt: w.createdAt,
    description: w.description,
    logoUrl: w.logoUrl,
    name: w.name,
    ownerId: w.ownerId,
    slug: w.slug,
    updatedAt: w.updatedAt,
  }));

  return { data: dto, success: true };
}

// This function is used to update the role of a user in a workspace
export async function updateUserRole(
  memberId: TMemberId,
  workspaceId: TWorkspaceId,
  role: TUserRole,
): Promise<APIResponse<{ role: string }>> {
  try {
    await workspaceMemberManager.updateMemberRole(workspaceId, memberId, role);

    return {
      success: true,
      data: {
        role,
      },
    };
  
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      error: `Failed to update user role: ${message}`,
      success: false,
    };
  }
}

// New function to fetch and set workspace details from the DB
export async function getWorkspaceById(workspaceId: TWorkspaceId) {
  try {
    const workspace = await workspaceMemberManager.findWorkspaceById(workspaceId);

    if (!workspace) {
      return { message: "Workspace not found", success: false };
    }

    return { data: workspace, success: true };
  } catch (error: unknown) {
    return {
      error: `Failed to fetch workspace by id: ${error}`,
      success: false,
    };
  }
}

export async function getFullWorkspaceDetail(workspaceSlug: string): Promise<APIResponse<TFullWorkspaceDetail>> {
  try {
    const user = await getCurrentUser();
    if(!user) {
      return {
        error: "User not authenticated",
        success: false,
      }
    }

    const workspace = await workspaceMemberManager.findWorkspaceBySlug(workspaceSlug);

    if (!workspace) {
      return { success: false, error: "Workspace not found" };
    }

    const res = await workspaceMemberManager.listMembers(workspace.id);
    if (!res) {
      return { success: false, error: "Failed to fetch workspace members" };
    }

    const [owner] = res.filter((member) => member.role === "owner");

    const workspaceMembers = res.filter((member) => member.role !== "owner");

    const result: TFullWorkspaceDetail = {
      ...workspace,
      ownerDetail: owner,
      members: workspaceMembers,
    }
    
    return { 
      success: true, 
      data: result 
    };
  } catch (error: unknown) {
    return {
      error: `Failed to fetch full workspace details: ${error}`,
      success: false,
    };
  }
}

export async function getWorkspaceTUserRole(workspaceSlug: string) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return {
        error: "User not authenticated",
        success: false,
      };
    }
    const org = await auth.api.getActiveMemberRole({
      query: {
        userId: authUser.id,
        organizationSlug: workspaceSlug,
      },
      headers: await headers(),
    });

    if (!org || !org.role) {
      return {
        error: "Failed to retrieve user role",
        success: false,
      };
    }

    return org.role;
  } catch (error: unknown) {
    return {
      error: `Failed to get user role:\n ${error}`,
      success: false,
    };
  }
}

/**
 * Delete a workspace
 * Only owners can delete workspaces
 */
export async function deleteWorkspace(
  workspaceId: string,
): Promise<APIResponse<{ deleted: boolean }>> {
  try {
    // Check if user has permission to delete
    const permission = await canDeleteWorkspace();

    if (!permission.allowed) {
      return {
        error:
          "You don't have permission to delete this workspace. Only owners can delete workspaces.",
        success: false,
      };
    }

    // Use better-auth's API to delete the organization
    await auth.api.deleteOrganization({
      headers: await headers(),
      body: {
        organizationId: workspaceId,
      },
    });

    return { data: { deleted: true }, success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      error: `Failed to delete workspace: ${message}`,
      success: false,
    };
  }
}

/**
 * Get the active meeting for a workspace by its slug.
 * @param workspaceSlug The slug of the workspace to get the active meeting for.
 * @returns An API response containing the active meeting details or an error message.
 * @requires authentication
 */
export async function getActiveMeetingForWorkspace(workspaceSlug: string) {
  try {
    const workspace = await workspaceMemberManager.findWorkspaceBySlug(workspaceSlug);

    if (!workspace) {
      return { message: "Workspace not found", success: false };
    }

    const activeMeeting = await workspaceMeetingManager.listWorkspaceMeetings(workspace.id, {
      status: "active"
    });

    if (!activeMeeting) {
      return { message: "No active meeting found", success: false };
    }

    return { meeting: activeMeeting, success: true };
  } catch (error: unknown) {
    return {
      error: `Failed to get active meeting for workspace: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
      success: false,
    };
  }
}