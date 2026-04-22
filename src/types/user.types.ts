import { BRAND } from "better-auth";
import { TUserId } from "./id.types";

type Input<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type TCreateUserInput = Input<IUserDTO> & { password: string };

export interface IUserDTO {
  id: TUserId;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}


