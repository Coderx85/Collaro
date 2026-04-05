import { ID } from "@collaro/utils/generate";
import { IUser, IUserDTO, IUserStore, TCreateUserInput, TUserId } from "./interface";
import { UserStore } from "./user-store";
import { Prettify } from "better-auth";

export class User implements IUser {
  // private async fetchUser(id: TUserId): Promise<IUserDTO | null> {
  //   const user = await this.store.findById(id);
  //   return user;
  // }

  user: IUserDTO = {} as IUserDTO;
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

  async updateUser(id: TUserId, user: Partial<IUserDTO>): Promise<IUserDTO | null> {
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
}