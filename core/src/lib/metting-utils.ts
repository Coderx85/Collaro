import { TMeetingId } from "@/types";

export function createMeetingLink(meetingId: TMeetingId): string {
  return `${window.location.origin}/meetings/${meetingId}`;
}