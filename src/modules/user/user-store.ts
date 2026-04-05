import { db } from "@/db";
import { IUserDTO, IUserStore, TUserId } from "./interface"
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
      name: user.name,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  async findById(id: TUserId): Promise<IUserDTO | null> {
    try {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));

      if (!user) {
        return null;
      }
      
      const result: IUserDTO = {
        id: user.id,
        name: user.name,
        userName: user.userName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || null,
        email: user.email,
      }

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
        userName: user.userName,
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
    return users;
  }
}