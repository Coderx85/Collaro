import { SelectWorkspaceType } from "@/db/schema/type";

export type TWorkspace = SelectWorkspaceType

export type TWorkspaceDTO = Omit<TWorkspace, "createdAt" | "updatedAt"> & {
  createdBy: string;
} 