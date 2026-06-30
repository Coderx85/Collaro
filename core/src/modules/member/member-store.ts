import { db } from "@/db";
import { membersTable } from "@/db/schema/schema";
import { and, eq } from "drizzle-orm";
import { IMemberDTO, IMemberStore } from ".";
import { IWorkspaceDTO } from "../workspace";
import { TMemberId } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";

export class MemberStore implements IMemberStore {
  async save(member: IMemberDTO): Promise<void> {
    const dto: IMemberDTO = {
      id: member.id,
      name: member.name,
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };

    const [newMember] = await db.insert(membersTable).values(dto).returning();

    if (!newMember) {
      throw new Error("Failed to save member to the database.");
    }

    return;
  }

  async findById(id: TMemberId): Promise<IMemberDTO | null> {
    try {
      const [member] = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.id, id));

      if (!member) {
        console.log(`Member with ID: ${id} not found in the database.`);
        return null;
      }

      const memberDTO: IMemberDTO = {
        id: member.id,
        name: member.name,
        userId: member.userId,
        workspaceId: member.workspaceId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };

      if (!memberDTO) {
        throw new Error(
          `Failed to convert database record to IMemberDTO for member ID: ${id}.`,
        );
      }

      return memberDTO || null;
    } catch (error: unknown) {
      console.error(
        `Error occurred while fetching member with ID: ${id}`,
        error,
      );
      return null;
    }
  }

  async listWorkspaceMembers(
    workspaceId: IWorkspaceDTO["id"],
  ): Promise<IMemberDTO[]> {
    return tryCatch({
      ctx: async () => {
        const members = await db
          .select()
          .from(membersTable)
          .where(eq(membersTable.workspaceId, workspaceId));

        return members.map((member) => ({
          id: member.id,
          name: member.name,
          userId: member.userId,
          workspaceId: member.workspaceId,
          role: member.role,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        }));
      },
    });
  }

  async delete(id: TMemberId): Promise<void> {
    try {
      await db.delete(membersTable).where(eq(membersTable.id, id));
    } catch (error) {
      console.error(
        `Error occurred while deleting member with ID: ${id}`,
        error,
      );
      throw new Error(`Failed to delete member with ID: ${id}`);
    }
  }

  async list(): Promise<IMemberDTO[]> {
    try {
      const members = await db.select().from(membersTable);

      return members.map((member) => ({
        id: member.id,
        name: member.name,
        userId: member.userId,
        workspaceId: member.workspaceId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      }));
    } catch (error: unknown) {
      throw new Error(`Error occurred while listing members.`, {
        cause: error,
      });
    }
  }

  async update(id: TMemberId, member: Partial<IMemberDTO>): Promise<void> {
    const memberToUpdate = await this.findById(id);

    if (!memberToUpdate)
      throw new Error(`Member with ID: ${id} not found. Cannot update.`);

    const updatedMember: IMemberDTO = {
      ...memberToUpdate,
      ...member,
      updatedAt: new Date(),
    };

    try {
      const result = await db
        .update(membersTable)
        .set({
          name: updatedMember.name,
          userId: updatedMember.userId,
          workspaceId: updatedMember.workspaceId,
          role: updatedMember.role,
          updatedAt: updatedMember.updatedAt,
        })
        .where(eq(membersTable.id, id));

      if (!result) {
        throw new Error(
          `Failed to update member with ID: ${id} in the database.`,
        );
      }

      return;
    } catch (error) {
      console.error(
        `Error occurred while updating member with ID: ${id}`,
        error,
      );
      throw new Error(`Failed to update member with ID: ${id}`);
    }
  }

  async checkMemberExists(
    workspaceId: IWorkspaceDTO["id"],
    memberId: TMemberId,
  ): Promise<boolean> {
    try {
      const [member] = await db
        .select()
        .from(membersTable)
        .where(
          and(
            eq(membersTable.id, memberId),
            eq(membersTable.workspaceId, workspaceId),
          ),
        );

      return !!member;
    } catch (error: unknown) {
      throw new Error(
        `Error occurred while checking if member with ID: ${memberId} exists in workspace ID: ${workspaceId}.`,
        { cause: error },
      );
    }
  }
}