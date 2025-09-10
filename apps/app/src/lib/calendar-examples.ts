/**
 * Example usage of the calendar ICS generation functions
 * This file demonstrates how to use the meeting ICS generation functionality
 */

import { downloadMeetingICS, generateMeetingICS, createSampleMeeting, type Meeting } from './calendar-client';

// Example 1: Download ICS file for a sample meeting
export function downloadSampleMeeting() {
  const sampleMeeting = createSampleMeeting();
  downloadMeetingICS(sampleMeeting);
}

// Example 2: Create a custom meeting and download ICS
export function downloadCustomMeeting() {
  const customMeeting: Meeting = {
    id: 'meeting-456',
    title: 'Project Planning Session',
    description: 'Plan the next quarter roadmap and discuss resource allocation',
    startTime: new Date('2025-09-05T14:00:00'),
    endTime: new Date('2025-09-05T15:30:00'),
    attendees: [
      'alice@company.com',
      'bob@company.com',
      'charlie@company.com'
    ],
    meetingLink: 'https://meet.collaro.com/room/planning-123',
    workspaceId: 'workspace-789',
    hostedBy: 'Alice Johnson',
    hostEmail: 'alice@company.com'
  };

  // Download with custom options
  downloadMeetingICS(customMeeting, {
    timezone: 'Asia/Kolkata',
    calendarName: 'Collaro Project Planning',
    defaultDurationHours: 1.5
  });
}

// Example 3: Generate ICS content as string (for API usage)
export function generateMeetingICSString(): string {
  const meeting = createSampleMeeting();
  return generateMeetingICS(meeting);
}

// Example 4: Meeting without end time (will default to 1 hour)
export function downloadMeetingWithoutEndTime() {
  const meeting: Meeting = {
    id: 'quick-meeting-789',
    title: 'Quick Check-in',
    description: 'Brief status update',
    startTime: new Date('2025-09-06T10:00:00'),
    // No endTime - will default to 1 hour
    attendees: ['teammate@company.com'],
    meetingLink: 'https://meet.collaro.com/room/checkin-789',
    workspaceId: 'workspace-123',
    hostedBy: 'Project Manager',
    hostEmail: 'pm@company.com'
  };

  downloadMeetingICS(meeting);
}

// Example 5: For use in a React component or Next.js page
export function handleDownloadMeetingICS(meetingData: Meeting) {
  try {
    downloadMeetingICS(meetingData, {
      timezone: 'Asia/Kolkata',
      calendarName: 'Collaro Meeting Calendar'
    });
    
    // You could show a success message to the user
    console.log('ICS file download initiated successfully');
  } catch (error) {
    console.error('Error generating ICS file:', error);
    // Handle error appropriately in your UI
  }
}
