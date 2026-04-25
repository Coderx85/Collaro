import { Prettify } from "better-auth";
import { IUserDTO as dto, TCreateUserInput, TUserId } from "@/types";
import { INotificationDTO } from "../notification";

export interface IUserDTO extends dto {}

export interface IUser {
  user: IUserDTO;

  // methods
  createUser(input: Prettify<TCreateUserInput>): Promise<IUserDTO>;
  getUser(id: TUserId): Promise<IUserDTO | null>;
  updateUser(id: TUserId, user: Partial<IUserDTO>): Promise<IUserDTO | null>;
  deleteUser(id: TUserId): Promise<void>;
  listNotifications(userId: TUserId): Promise<INotificationDTO[]>;
}

export interface IUserStore {
  save(user: IUserDTO): Promise<void>;
  findById(id: TUserId): Promise<IUserDTO | null>;
  update(id: TUserId, user: IUserDTO): Promise<IUserDTO | null>;
  delete(id: TUserId): Promise<void>;
  list(): Promise<IUserDTO[]>;
}