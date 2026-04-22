import { SelectWorkspaceType } from "@/db/schema/type";
import { TUserId } from "./id.types";

export type TWorkspace = SelectWorkspaceType

export type TWorkspaceDTO = Omit<TWorkspace, "createdAt" | "updatedAt"> & {
  createdBy: TUserId;
} 