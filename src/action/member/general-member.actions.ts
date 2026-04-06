"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth-server";
import type { APIResponse, TInviteMemberRole, TOrganizationMember, TUserRole } from "@/types";
import { db } from "@/db";
import { createMemberSchema } from "@/db/schema/type";
import { membersTable } from "@/db/schema/schema";
import z from "zod";
import { getWorkspaceBySlug } from "../workspace/get-workspace.actions";
import { getWorkspaceById } from "../workspace";
import { eq } from "drizzle-orm";
import type { Prettify, User } from "better-auth";
type MemberResponse = APIResponse<TOrganizationMember>;

type CreateMemberDTO = z.infer<typeof createMemberSchema>;

type MemberListDTO = Prettify<z.infer<typeof createMemberSchema> & { user: User }>;


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

export const getMembersBySlug = async (slug: string, options: {
  offset?: number;
  limit?: number;
}): Promise<APIResponse<MemberListDTO[]>> => {
  try {
    const workspace = await getWorkspaceBySlug(slug);

    const offset = options.offset || 0;
    const limit = options.limit || 10;

    if (!workspace || !workspace.success || !workspace.data) {
      return { success: false, error: "Workspace not exsist" };
    }

    const members = await db.query.membersTable
      .findMany({
        where: eq(membersTable.workspaceId, workspace.data.id),
        with: {
          user: true,
        },
        limit,
        offset,
      })
      .execute();

    const result: MemberListDTO[] = members.map((member) => ({
      id: member.id,
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role as TUserRole,
      createdAt: member.createdAt,
      updatedAt: member.createdAt,
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        username: member.user.email,
        createdAt: member.user.createdAt,
        updatedAt: member.user.updatedAt || member.user.createdAt,
        emailVerified: member.user.emailVerified ?? false,
        image: "",
      }
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to get members: ${error instanceof Error ? error.message : String(error)}`);
  }
}