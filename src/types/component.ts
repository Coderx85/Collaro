import { IconType } from "react-icons/lib";

export interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

export interface MeetingDetailsProps {
  startTime: Date;
  description: string;
  meetingLink: string;
}

export interface SidebarProps {
  params: {
    workspaceId: string;
    url: {
      pathname: string;
    };
  };
}

export type SidebarLink = {
  route: string;
  label: string;
  details: string;
  component: React.ComponentType<{ selected: boolean; className: string }>;
  adminRoute: boolean;
};

export interface NavLinks {
  role: "admin" | "member";
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
  id: number;
  title: string;
  message: string;
  meetingId?: string;
  workspaceId?: string;
  scheduledFor?: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}
