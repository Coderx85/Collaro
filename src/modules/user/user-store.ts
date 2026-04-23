import { db } from "@/db";
import { IUserStore } from "./interface"
import { IUserDTO, TUserId } from "@/types";
import { usersTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

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

  async findById(id: TUserId): Promise<IUserDTO | null> {
    try {
      const user = await db
        .query.usersTable.findFirst({
          where: eq(usersTable.id, id),
        })

      if (!user) {
        return null;
      }
      
      const result: IUserDTO = {
        id: user.id,
        name: user.name,
        username: user?.userName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || null,
        email: user.email,
      };

      return result;
    } catch (err: unknown){
      throw new Error(`Error fetching user with ID: ${id}`);
    }
  }
  async update(id: TUserId, user: Partial<IUserDTO>): Promise<IUserDTO | null> {
    await db
      .update(usersTable)
      .set({
        name: user.name,
        userName: user?.username,
        email: user.email,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id));

    return this.findById(id);
  }
  async delete(id: TUserId): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id));
  }
  async list(): Promise<IUserDTO[]> {
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
}