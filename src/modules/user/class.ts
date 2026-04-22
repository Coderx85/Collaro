import { ID } from "@collaro/utils/generate";
import { IUser, IUserStore } from "./interface";
import { IUserDTO, TUserId, TCreateUserInput } from "@/types";
import { UserStore } from "./user-store";
import { Prettify } from "better-auth";
import {
  INotificationDTO,
  INotificationStore,
  notificationStore,
} from "../notification";
import tryCatch from "@/lib/try-catch-wrapper";

export class User implements IUser {
  user: IUserDTO = {} as IUserDTO;
  notificationService: INotificationStore = notificationStore;
  private store: IUserStore = UserStore.getInstance();

  private async findById(id: TUserId): Promise<IUserDTO | null> {
    const user = await this.store.findById(id);
    return user;
  }

  async createUser(input: Prettify<TCreateUserInput>): Promise<IUserDTO> {
    try {
      const newUser: IUserDTO = {
        ...input,
        id: ID.userId(),
        createdAt: new Date(),
        updatedAt: null,
      };

      // Save the new user to the store
      await this.store.save(newUser);

      // Update the user property with the newly created user
      this.user = newUser;

      // return the newly created user
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${(error as Error).message}`);
    }
  }

  async updateUser(
    id: TUserId,
    user: Partial<IUserDTO>,
  ): Promise<IUserDTO | null> {
    try {
      const existingUser = await this.findById(id);

      if (existingUser) {
        this.store.update(id, user);

        return this.store.findById(id);
      }

      return this.user.id === id ? this.user : null;
    } catch (error) {
      throw new Error(`Error updating user: ${(error as Error).message}`);
    }
  }

  async deleteUser(id: TUserId): Promise<void> {
    try {
      await this.store.delete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${(error as Error).message}`);
    }
  }

  async getUser(id: TUserId): Promise<IUserDTO | null> {
    try {
      return await this.findById(id);
    } catch (error: unknown) {
      throw new Error(`Error fetching user: ${(error as Error).message}`);
    }
  }

  get listUsers(): IUserDTO[] {
    // Implementation to return a list of users
    return [this.user];
  }

  async listNotifications(userId: TUserId): Promise<INotificationDTO[]> {
    return tryCatch({
      ctx: async () => {
        return await this.notificationService.queryNotifications({ userId });
      },
    });
  }
}

export const userService = new User();