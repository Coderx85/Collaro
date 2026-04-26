import type { IconType } from "react-icons/lib";
import type { TUserRole } from "@/types";
import { ComponentType } from "react";

export interface CalendarExportProps {
  meetingId: string;
  meetingTitle: string;
  startTime: Date;
  endTime?: Date;
  description?: string;
  location?: string;
  meetingLink?: string;
  workspaceId?: string;
  hostedBy?: string;
  hostEmail?: string;
  attendees?: string[];
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export interface MeetingCardProps {
  title: string;
  date: string;
  icon: ComponentType<{ className?: string }>;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  // Optional calendar export properties
  meetingId?: string;
  startTime?: Date;
  endTime?: Date;
  description?: string;
  location?: string;
}

export interface MeetingDetailsProps {
  startTime: Date;
  description: string;
  meetingLink: string;
}

export interface SidebarProps {
  params: {
    workspaceSlug: string;
    url: {
      pathname: string;
    };
  };
}

export type SidebarLink = {
  route: string;
  label: string;
  details: string;
  component: ComponentType<{ selected: boolean; className?: string }>;
  adminRoute: boolean;
};

export interface SidebarLinks {
  role: TUserRole;
  workspaceId: string;
}

export interface WorkspaceInitializerProps {
  workspaceId?: string;
  workspaceName?: string;
  members?: {
    id: string;
    name: string;
    userName: string;
    email: string;
    role: string;
  }[];
}

export interface FeatureCard {
  icon: IconType;
  title: string;
  description: string;
}

export interface NotificationProps {
  id: number | string;
  title: string;
  message: string;
  meetingId?: string;
  workspaceId?: string;
  scheduledFor?: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export interface WorkspaceNotificationProps {
  id: string;
  userId: string;
  workspaceId: string;
  type:
    | "join_request_sent"
    | "join_request_approved"
    | "join_request_rejected"
    | "member_joined"
    | "member_left"
    | "member_removed"
    | "workspace_settings_changed";
  title: string;
  message: string;
  status: "unread" | "read" | "archived";
  relatedEntityId?: string;
  relatedEntityType?: "join_request" | "member" | "workspace";
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}
