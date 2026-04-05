import { BRAND } from "@collaro/utils/brand";
import { Prettify } from "better-auth";
import { Input } from "../utils/omit";

export type TUserId = BRAND<"UserId">;
export type TCreateUserInput = Input<IUserDTO> & { password: string };

export interface IUserDTO {
  id: TUserId;
  name: string;
  userName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}

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