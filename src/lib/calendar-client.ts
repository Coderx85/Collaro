import { ICalCalendar, ICalEventStatus } from "ical-generator";

/**
 * Meeting interface matching your data structure
 */
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  attendees?: string[];
  meetingLink: string;
  workspaceId: string;
  hostedBy: string;
  hostEmail: string;
}

/**
 * Options for ICS generation
 */
export interface ICSGenerationOptions {
  timezone?: string;
  calendarName?: string;
  defaultDurationHours?: number;
}

/**
 * Generates and downloads an ICS file for a single meeting event
 *
 * @param meeting - The meeting object containing event details
 * @param options - Optional configuration for ICS generation
 */
export function downloadMeetingICS(
  meeting: Meeting,
  options: ICSGenerationOptions = {},
): void {
  const {
    timezone = "Asia/Kolkata",
    calendarName = "Collaro Meeting",
    defaultDurationHours = 1,
  } = options;

  // Validate required fields
  if (!meeting.id || !meeting.title || !meeting.startTime) {
    throw new Error("Meeting must have id, title, and startTime");
  }

  // Calculate end time if not provided (default 1 hour duration)
  const endTime =
    meeting.endTime ||
    new Date(
      meeting.startTime.getTime() + defaultDurationHours * 60 * 60 * 1000,
    );

  // Create the calendar
  const calendar = new ICalCalendar({
    name: calendarName,
    prodId: "//collaro.com//meeting-calendar//EN",
    timezone: timezone,
  });

  // Prepare description with meeting link
  const description = [
    meeting.description || "",
    "",
    "Join the meeting:",
    meeting.meetingLink,
    "",
    `Hosted by: ${meeting.hostedBy}`,
    `Workspace: ${meeting.workspaceId}`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  // Prepare attendees list
  const attendees =
    meeting.attendees?.map((email) => ({
      email: email,
      rsvp: true,
    })) || [];

  // Create the event
  calendar.createEvent({
    id: meeting.id,
    start: meeting.startTime,
    end: endTime,
    timezone: timezone,
    summary: meeting.title,
    description: description,
    location: "Online Meeting", // Since it's a video meeting
    url: meeting.meetingLink,
    organizer: {
      name: meeting.hostedBy,
      email: meeting.hostEmail,
    },
    attendees: attendees,
    // Add some useful metadata
    created: new Date(),
    lastModified: new Date(),
    // Meeting-specific properties
    categories: [{ name: "Meeting" }, { name: "Video Conference" }],
    status: ICalEventStatus.CONFIRMED,
  });

  // Generate ICS content
  const icsContent = calendar.toString();

  // Create and trigger download
  downloadICSFile(icsContent, meeting.title);
}

/**
 * Helper function to trigger file download in the browser
 *
 * @param icsContent - The ICS file content as string
 * @param meetingTitle - Meeting title for filename generation
 */
function downloadICSFile(icsContent: string, meetingTitle: string): void {
  const filename = `invite.ics`;

  // Create blob with proper MIME type
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });

  // Create download URL
  const url = URL.createObjectURL(blob);

  // Create temporary anchor element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  // Add to DOM, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Alternative function that returns ICS content as string
 * Useful for API endpoints or email attachments
 *
 * @param meeting - The meeting object containing event details
 * @param options - Optional configuration for ICS generation
 * @returns ICS content as string
 */
export function generateMeetingICS(
  meeting: Meeting,
  options: ICSGenerationOptions = {},
): string {
  const {
    timezone = "Asia/Kolkata",
    calendarName = "Collaro Meeting",
    defaultDurationHours = 1,
  } = options;

  // Validate required fields
  if (!meeting.id || !meeting.title || !meeting.startTime) {
    throw new Error("Meeting must have id, title, and startTime");
  }

  // Calculate end time if not provided
  const endTime =
    meeting.endTime ||
    new Date(
      meeting.startTime.getTime() + defaultDurationHours * 60 * 60 * 1000,
    );

  // Create the calendar
  const calendar = new ICalCalendar({
    name: calendarName,
    prodId: "//collaro.com//meeting-calendar//EN",
    timezone: timezone,
  });

  // Prepare description with meeting link
  const description = [
    meeting.description || "",
    "",
    "Join the meeting:",
    meeting.meetingLink,
    "",
    `Hosted by: ${meeting.hostedBy}`,
    `Workspace: ${meeting.workspaceId}`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  // Prepare attendees list
  const attendees =
    meeting.attendees?.map((email) => ({
      email: email,
      rsvp: true,
    })) || [];

  // Create the event
  calendar.createEvent({
    id: meeting.id,
    start: meeting.startTime,
    end: endTime,
    timezone: timezone,
    summary: meeting.title,
    description: description,
    location: "Online Meeting",
    url: meeting.meetingLink,
    organizer: {
      name: meeting.hostedBy,
      email: meeting.hostEmail,
    },
    attendees: attendees,
    created: new Date(),
    lastModified: new Date(),
    categories: [{ name: "Meeting" }, { name: "Video Conference" }],
    status: ICalEventStatus.CONFIRMED,
  });

  return calendar.toString();
}

/**
 * Example usage and utility functions
 */

/**
 * Creates a sample meeting object for testing
 */
export function createSampleMeeting(): Meeting {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    id: "meeting-123",
    title: "Weekly Team Standup",
    description: "Discuss project progress and blockers",
    startTime: tomorrow,
    endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // 1 hour later
    attendees: ["john@example.com", "jane@example.com"],
    meetingLink: "https://meet.collaro.com/room/abc123",
    workspaceId: "workspace-456",
    hostedBy: "John Doe",
    hostEmail: "john@example.com",
  };
}
