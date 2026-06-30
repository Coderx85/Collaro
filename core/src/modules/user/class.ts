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

  async updateUser(
    id: TUserId,
    user: Partial<IUserDTO>,
  ): Promise<IUserDTO | null> {
    try {
      // First, find the existing user by ID
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error("USER NOT FOUND", {
          cause: "No user found with the provided ID",
        });
      }

      // Merge the existing user data with the new data
      const updatedUser: IUserDTO = {
        ...existingUser,
        ...user,
        updatedAt: new Date(),
      };

      // Update the user in the store
      await this.store.update(id, updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error("Error updating user: ", {
        cause: error,
      })
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