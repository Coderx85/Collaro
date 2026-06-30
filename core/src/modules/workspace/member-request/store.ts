import { INotificationStore } from "@collaro/notification";
import { IMemberRequestStore, MemberRequestParams, TRequestId } from "./interface";
import { db } from "@/db";
import { workspaceRequestTable } from "@/db/schema/schema";
import { ID } from "@/modules/utils/generate";
import tryCatch from "@/lib/try-catch-wrapper";
import { and, eq, SQL } from "drizzle-orm";
import { IRequestMemberDTO } from "@/types";

export class MemberRequestStore implements IMemberRequestStore {
  notification: INotificationStore = {} as INotificationStore;
  private static instance: MemberRequestStore;

  private constructor() {
    if (MemberRequestStore.instance) {
      throw new Error("Use MemberRequestStore.getInstance() to get the singleton instance.");
    }
  }

  public static getInstance(): MemberRequestStore {
    if (!MemberRequestStore.instance) {
      MemberRequestStore.instance = new MemberRequestStore();
    }

    return MemberRequestStore.instance;
  }

  async save(request: IRequestMemberDTO): Promise<void> {
    const dto: IRequestMemberDTO = {
      ...request,
      id: ID.requestId(),
      createdAt: new Date(),
      updatedAt: null,
      respondedBy: null,
    }

    return tryCatch({
      ctx: async () => {
        await db
          .insert(workspaceRequestTable)
          .values({
            ...dto,
          });
      }
    })
  }

  delete(id: TRequestId): Promise<void> {
    return tryCatch({
      ctx: async () => {
        await db
          .delete(workspaceRequestTable)
          .where(eq(workspaceRequestTable.id, id));
      }
    });
  }

  async findById(id: TRequestId): Promise<IRequestMemberDTO | null> {
    return tryCatch({
      ctx: async () => {
        const result = await db.query.workspaceRequestTable.findFirst({
          where: eq(workspaceRequestTable.id, id)
        })

        if (!result) {
          return null;
        }

        return {
          ...result,
          role: "member",
          createdAt: result.requestedAt,
          updatedAt: result.respondedAt,
        };
      }
    })
  }

  async list(): Promise<IRequestMemberDTO[]> {
    return tryCatch({
      ctx: async () => {
        const results = await db.query.workspaceRequestTable.findMany();

        return results.map(result => ({
          ...result,
          role: "member",
          createdAt: result.requestedAt,
          updatedAt: result.respondedAt,
        }));
      }
    })
  }

  async update(id: TRequestId, request: IRequestMemberDTO): Promise<void> {
    const updatedRequest: IRequestMemberDTO = {
      ...request,
      updatedAt: new Date(),
    }

    return tryCatch({
      ctx: async () => {
        await db
          .update(workspaceRequestTable)
          .set({
            ...updatedRequest,
          })
          .where(eq(workspaceRequestTable.id, id));
      }
    })
  }

  async query(params: MemberRequestParams): Promise<IRequestMemberDTO[]> {
    const { workspaceId, userId } = params.query;

    const whereClause: SQL<unknown>[] = []

    if (workspaceId) {
      whereClause.push(eq(workspaceRequestTable.workspaceId, workspaceId));
    }

    if (userId) {
      whereClause.push(eq(workspaceRequestTable.userId, userId));
    }

    return tryCatch({
      ctx: async () => {
        const results = await db.query.workspaceRequestTable.findMany({
          where: and(...whereClause)
        });

        return results.map(result => ({
          id: result.id,
          name: result.name,
          userId: result.userId,
          workspaceId: result.workspaceId,
          role: "member",
          status: result.status,
          respondedBy: result.respondedBy,
          createdAt: result.requestedAt,
          updatedAt: result.respondedAt
        }));
      }
    })
  }
}

export const memberRequestStore = MemberRequestStore.getInstance();