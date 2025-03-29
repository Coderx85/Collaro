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

export type SidebarLink = {
  route: string;
  label: string;
  details: string;
  component: React.ComponentType<{ selected: boolean; className: string }>;
  adminRoute: boolean;
};

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
