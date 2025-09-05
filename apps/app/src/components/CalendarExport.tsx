'use client';

import { downloadMeetingICS, type Meeting } from '../lib/calendar-client';
import { useToast } from '@repo/design/components/ui/use-toast';
import { Calendar } from 'lucide-react';
import { Button } from '@repo/design/components/ui/button';

interface CalendarExportProps {
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
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CalendarExport({
  meetingId,
  meetingTitle,
  startTime,
  endTime,
  description,
  meetingLink,
  workspaceId,
  hostedBy,
  hostEmail,
  attendees = [],
  variant = 'default',
  size = 'default',
  className
}: CalendarExportProps) {
  const { toast } = useToast();

  const handleCalendarExport = () => {
    try {
      // Validate required fields
      if (!meetingId || !meetingTitle || !startTime) {
        toast({ 
          title: 'Error', 
          description: 'Missing required meeting information',
          variant: 'destructive'
        });
        return;
      }

      // Convert to Meeting interface
      const meeting: Meeting = {
        id: meetingId,
        title: meetingTitle,
        description: description || `Meeting: ${meetingTitle}`,
        startTime: startTime,
        endTime: endTime || new Date(startTime.getTime() + 60 * 60 * 1000), // Default 1 hour
        attendees: attendees,
        meetingLink: meetingLink || `https://collaro.vercel.app/${meetingId}`,
        workspaceId: workspaceId || 'default-workspace',
        hostedBy: hostedBy || 'Collaro User',
        hostEmail: hostEmail || 'user@collaro.com'
      };

      // Generate and download ICS file
      downloadMeetingICS(meeting, {
        timezone: 'Asia/Kolkata',
        calendarName: 'Collaro Meeting Calendar',
        defaultDurationHours: 1
      });

      toast({ 
        title: 'Calendar Export', 
        description: 'ICS file downloaded successfully!' 
      });

    } catch (error) {
      console.error('Calendar export error:', error);
      toast({ 
        title: 'Export Failed', 
        description: 'Failed to generate calendar file',
        variant: 'destructive'
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-transparent border !w-full border-slate-700 text-sky-2 hover:bg-slate-800/40 hover:border-sky-400 ${className || ''}`}
      onClick={handleCalendarExport}
      title="Add to Calendar"
    >
      <Calendar className="mr-2 h-4 w-4" />
      Add to Calendar
    </Button>
  );
}
