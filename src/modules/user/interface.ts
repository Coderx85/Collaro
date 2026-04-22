import { Prettify } from "better-auth";
import { IUserDTO, TCreateUserInput, TUserId } from "@/types";

export interface IUser {
  user: IUserDTO;

  // methods
  createUser(input: Prettify<TCreateUserInput>): Promise<IUserDTO>;
  getUser(id: TUserId): Promise<IUserDTO | null>;
  updateUser(id: TUserId, user: Partial<IUserDTO>): Promise<IUserDTO | null>;
  deleteUser(id: TUserId): Promise<void>;
}

export interface IUserStore {
  save(user: IUserDTO): Promise<void>;
  findById(id: TUserId): Promise<IUserDTO | null>;
  update(id: TUserId, user: Partial<IUserDTO>): Promise<IUserDTO | null>;
  delete(id: TUserId): Promise<void>;
  list(): Promise<IUserDTO[]>;
}