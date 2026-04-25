import { db } from "@/db";
import { IUserStore } from "./interface"
import { IUserDTO, TUserId } from "@/types";
import { usersTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import tryCatch from "@/lib/try-catch-wrapper";

const dummyStore: IUserDTO[] = [];

export class UserStore implements IUserStore {
  private static instance: UserStore;

  public static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  async save(user: IUserDTO): Promise<void> {
    tryCatch({
      ctx: async () => {
        await db.insert(usersTable).values({
          id: user.id,
          userName: user.username,
          name: user.name,
          emailVerified: null,
          password: "",
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: null,
        });
      }
    })
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
          id: user.id,
          name: user.name,
          username: user.userName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || null,
        };
      }
    })
  }

  async update(id: TUserId, user: IUserDTO): Promise<IUserDTO | null> {
    return tryCatch({
      ctx: async () => {
        const [result] = await db
        .update(usersTable)
        .set({
          name: user.name,
          userName: user.username,
          email: user.email,
          updatedAt: user.updatedAt,
          })
        .where(eq(usersTable.id, id))
        .returning();

        if (!result) {
          return null;
        }

        return {
          id: result.id,
          name: result.name,
          username: result.userName,
          email: result.email,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
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
            id: user.id,
            name: user.name,
            username: user?.userName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt || null,
            email: user.email,
          })),
        };
      }
    })
  }
}