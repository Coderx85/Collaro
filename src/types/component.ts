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
};