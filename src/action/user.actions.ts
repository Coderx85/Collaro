"use server";

import type { APIResponse, IMemberDTO, IUserDTO, IWorkspaceDTO, TFullUserWorkspaceDetail, TUserId, TWorkspaceId, UserResponse } from "@/types";
import { headers } from "next/headers";
import { auth, Session } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import type { RegisterFormValues } from "@/types";
import { revalidatePath } from "next/cache";
import { tryCatchAction } from "@/lib/try-catch-wrapper";
import { User as UserManager } from "@/modules/user";
import { workspaceMemberManager } from "@/modules/manager/workspace-manager";
import { getAllWorkspaces } from "./workspace";

type TSession = Session["session"];

interface GetCurrentUserResponse extends TSession {
  user: {
    id: TUserId;
    name: string;
    email: string;
    userName: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date | null;
  }
}

interface IUpdateUserInput {
  email?: string;
  name?: string;
  userName?: string;
}

const userService = new UserManager();

// Helper to get current authenticated user
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No active session found");
  }

  if (!session?.user) {
    redirect(config.SIGN_IN);
  }

  const userId = session.user.id as unknown as TUserId;

  return {
    ...session.session,
    user: {
      id: userId,
      name: session.user.name,
      email: session.user.email,
      userName: session.user.userName || "",
      emailVerified: session.user.emailVerified,
      createdAt: new Date(session.user.createdAt),
      updatedAt: session.user.updatedAt ? new Date(session.user.updatedAt) : null,
    },
  };
}

export async function signUpAction({
  name,
  email,
  password,
  userName,
}: RegisterFormValues): Promise<APIResponse<{ user: UserResponse }>> {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        userName,
        password,
      },
      headers: await headers(),
    });

    if (!result || !result.user) {
      return { error: "Sign up failed", success: false };
    }

    return { data: { user: result.user as unknown as UserResponse }, success: true };
  } catch (error: unknown) {
    return { error: `Sign up failed: ${error}`, success: false };
  }
}

export async function loginAction(email: string, password: string): Promise<APIResponse<{message: string}>> {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(), // Crucial for setting cookies in Server Actions
    });

    if (!result) {
      return { error: "Invalid email or password", success: false };
    }

    return {
      data: { message: "Login successful" },
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return { error: errorMessage, success: false };
  }
}

export async function logoutAction(): Promise<APIResponse<{ message: string }>> {
  return tryCatchAction({
    ctx: async () => {
      await auth.api.signOut({
        headers: await headers(),
      });
      revalidatePath("/"); // Revalidate homepage or any other path as needed
      return { message: "Logout successful" };
    },
    errorMessage: "Logout failed",
  })
}

export async function updateUserAction(data: IUpdateUserInput): Promise<APIResponse<{ user: IUserDTO }>> {
  return tryCatchAction({
    ctx: async () => {

      const currentUser = await getCurrentUser();
      if (!currentUser?.user?.id) {
        throw new Error("User not authenticated");
      }

      const updatedUser = await userService.updateUser(currentUser.user.id, {
        ...data,
      });
      
      if (!updatedUser) {
        throw new Error("Failed to update user");
      }

      return { user: updatedUser,  };
    }
  });
}

type TOrganizationRole = "owner" | "admin" | "member";
export async function leaveOrganizationAction(
  organizationId: TWorkspaceId,
): Promise<APIResponse<{ left: true }>> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
      return { success: false, error: "User not authenticated" };
    }

    await auth.api.leaveOrganization({
      headers: requestHeaders,
      body: {
        organizationId: String(organizationId),
      }
    })

    revalidatePath("/user/settings");

    return {
      success: true,
      data: {
        left: true,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to leave organization: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function getUserWorkspaces(): Promise<APIResponse<TFullUserWorkspaceDetail[]>> {
  return tryCatchAction({
    ctx: async () => {

      const result: TFullUserWorkspaceDetail[] = [];

      const {user} = await getCurrentUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const workspaces = await workspaceMemberManager.listUserWorkspaces(user.id);
      if (!workspaces) {
        throw new Error("Failed to fetch user workspaces");
      }

      for (const workspace of workspaces) {
        const memberDetail = await workspaceMemberManager.getMemberDetail({
          userId: user.id,
          workspaceId: workspace.id,
        });

        if (!memberDetail) {
          throw new Error(`Failed to fetch member details for workspace ID: ${workspace.id}`);
        }

        result.push({
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          logoUrl: workspace.logoUrl,
          ownerId: workspace.ownerId,
          description: workspace.description,
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
          userDetail: memberDetail,
        })
      }

      return result;
    }
  })
}