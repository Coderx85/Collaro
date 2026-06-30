import { db } from "@/db";
import { IUserStore } from "./interface"
import { IUserDTO, TUserId } from "@/types";
import { usersTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import tryCatch from "@/lib/try-catch-wrapper";
import { INotificationDTO, INotificationStore, notificationStore } from "../notification";

const dummyStore: IUserDTO[] = [];

export class UserStore implements IUserStore {
  private static instance: UserStore;
  private readonly notificationStore: INotificationStore = notificationStore;

  public static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  async findById(id: TUserId): Promise<IUserDTO | null> {
    return tryCatch({
      ctx: async () => {
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.id, id),
        });

        if (!user) {
          return null;
        }

        return {
          ...user,
        };
      }
    })
  }

  async update(id: TUserId, user: IUserDTO): Promise<IUserDTO | null> {
    return tryCatch({
      ctx: async () => {
        const [result] = await db
        .update(usersTable)
        .set({ ...user })
        .where(eq(usersTable.id, id))
        .returning();

        if (!result) {
          return null;
        }

        return {
          ...result,
        };
      }
    })
  }

  async delete(id: TUserId): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id));
  }

  async list(): Promise<IUserDTO[]> {
    return tryCatch({
      ctx: async () => {
        const users = await db.select().from(usersTable);
        
        return {
          ...users.map((user) => ({
            ...user,
          })),
        };
      }
    })
  }

  async listNotifications(userId: TUserId): Promise<readonly INotificationDTO[]> {
    return tryCatch({
      ctx: async() => {
        return await this.notificationStore.queryNotifications({
          userId,
        })
      }
    })
  }
}