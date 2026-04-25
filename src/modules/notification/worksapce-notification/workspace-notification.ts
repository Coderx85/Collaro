import { ID } from "@collaro/utils/generate";
import { INotificationDTO, INotificationStore } from "../interface";
import { notificationStore } from "../notification-store";
import { IWorkspaceDTO } from "@collaro/workspace";
import { IUserDTO } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";

type TWorkspaceNotificationType = "workspace_created" | "workspace_updated" | "workspace_deleted" | "workspace_joined" | "workspace_left" | "settings_updated" | "logo_updated";

interface IWorkspaceNotificationDTO extends INotificationDTO {
  workspaceName: IWorkspaceDTO["name"];
  userName?: IUserDTO["name"];
  type: TWorkspaceNotificationType;
}

type TCreateWorkspaceNotificationInput = Omit<IWorkspaceNotificationDTO, "id" | "message" | "createdAt" | "updatedAt" | "read">;

function WorkspaceNotificationMessage(type: TWorkspaceNotificationType, workspaceName: string, userName?: string): string {
  switch (type) {
    case "workspace_created": 
      return `A new Workspace ` + workspaceName + " has been created by You.";
    case "workspace_updated":
      return "Workspace " + workspaceName + " has been updated by " + userName + ".";
    case "workspace_deleted":
      return "Workspace " + workspaceName + " has been deleted.";
    case "workspace_joined": 
      return "User " + userName + " has joined the workspace " + workspaceName + ".";
    case "workspace_left":
      return "User " + userName + " has left the workspace " + workspaceName + ".";
    case "settings_updated":
      return "Settings for workspace " + workspaceName + " have been updated.";
    case "logo_updated":
      return "Logo for workspace " + workspaceName + " has been updated.";
    default:
      return "You have a new notification.";
  }
}

type TMemberNotificationType = "join_request" | "request_approved" | "request_rejected" | "role_changed" | "member_banned" | "member_removed";

interface IMemberNotificationDTO extends INotificationDTO {
  type: TMemberNotificationType;
  userName: IUserDTO["name"];
  workspaceName: IWorkspaceDTO["name"];
}

type TCreateMemberNotificationInput = Omit<IMemberNotificationDTO, "id" | "message" | "createdAt" | "updatedAt" | "read">;

function MemberNotificationMessage(type: TMemberNotificationType, userName: string, workspaceName: string): string {
  switch (type) {
    case "join_request":
      return "You have a new join request from " + userName + ".";
    case "request_approved":
      return "Your join request to the workspace " + workspaceName + " has been approved.";
    case "request_rejected":
      return "Your join request to the workspace " + workspaceName + " has been rejected.";
    case "role_changed":
      return "Your role in the workspace " + workspaceName + " has been changed.";
    case "member_banned":
      return "You have been banned from the workspace " + workspaceName + ".";
    case "member_removed":
      return "You have been removed from the workspace " + workspaceName + ".";
    default:
      return "You have a new notification.";
  }
}

export class WorkspaceNotification {
  private static instance: WorkspaceNotification;
  store: INotificationStore = notificationStore;
  dto: INotificationDTO = {} as INotificationDTO;

  private constructor() {
    if (WorkspaceNotification.instance) {
      throw new Error("Use WorkspaceNotification.getInstance() to get the singleton instance.");
    }
  }

  public static getInstance(): WorkspaceNotification {
    if (!WorkspaceNotification.instance) {
      WorkspaceNotification.instance = new WorkspaceNotification();
    }

    return WorkspaceNotification.instance;
  }

  /**
   * Creates a workspace-related notification, such as workspace creation, updates, deletions, member joins/leaves, and settings changes.
   * @param input The input for creating a workspace notification, excluding fields that are generated automatically.
   * @returns The created notification DTO.
   * @throws An error if the notification creation fails.
   */
  async createWorkspaceNotification(
    input: TCreateWorkspaceNotificationInput
  ): Promise<INotificationDTO> {
    return tryCatch({
      ctx: async () => {
        const message = WorkspaceNotificationMessage(input.type, input.workspaceName, input.userName) || "";
    
        const dto: INotificationDTO = {
          ...input,
          id: ID.notificationId(),
          message,
          read: false,
          createdAt: new Date(),
        };
    
        await this.store.create({...dto});
    
        return dto;
      }
    })
  }

  /**
   * Creates a member-related notification, such as join requests, approvals, rejections, role changes, bans, and removals.
   * @param input The input for creating a member notification, excluding fields that are generated automatically.
   * @returns The created notification DTO.
   * @throws An error if the notification creation fails.
   */
  async createMemberNotification(
    input: TCreateMemberNotificationInput
  ): Promise<INotificationDTO> {
    return tryCatch({
      ctx: async () => {
        // 1. Generate the notification message
        const message = MemberNotificationMessage(input.type, input.userName, input.workspaceName) || "";
  
        // 2. Create the notification DTO
        const dto: INotificationDTO = {
          ...input,
          id: ID.notificationId(),
          message,
          read: false,
          createdAt: new Date(),
        };
    
        // 3. Save the notification to the store
        await this.store.create(dto)
    
        return dto;
      },
    })
  }

  /**
   * Marks a notification as read by its ID.
   * @param notificationId The ID of the notification to mark as read.
   * @returns A boolean indicating whether the operation was successful.
   * @throws An error if the notification is not found or if the operation fails.
   */
  async markAsRead(notificationId: INotificationDTO["id"]): Promise<boolean> {
    return tryCatch({
      ctx: async () => {
        const notification = await this.store.findById(notificationId);
        if (!notification) {
          throw new Error(`Notification with ID: ${notificationId} not found.`);
        }
  
        await this.store.markAsRead(notificationId);
        return true;
      }
    })
  }

  /**
   * Retrieves a list of notifications for a specific user.
   * @param userId The ID of the user for whom to retrieve notifications.
   * @returns An array of notification DTOs for the specified user.
   * @throws An error if the operation fails.
   */
  async listNotifications(userId: INotificationDTO["userId"]): Promise<INotificationDTO[]> {
    return tryCatch({
      ctx: async () => {
        return await this.store.queryNotifications({ userId });
      }
    })
  }
}

export const workspaceNotification = WorkspaceNotification.getInstance();