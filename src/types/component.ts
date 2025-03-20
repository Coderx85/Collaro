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