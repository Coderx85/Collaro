'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';
import { useUser } from '@clerk/nextjs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import Loader from './Loader';
import ReactDatePicker from 'react-datepicker';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

interface MeetingDetailsProps {
  startTime: Date;
  description: string;
  meetingLink: string;
}

const MeetingTypeList = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();

  // Grab workspaceId
  const pathname = usePathname();
  const workspaceId = pathname.split('/')[2];

  async function createMeetingDB(
    workspaceId: string,
    meetingDetails: {
      name: string;
      description: string;
      startAt: string;
      meetingId: string;
    },
  ) {
    const { name, description, startAt, meetingId } = meetingDetails;
    const res = await fetch(`/api/meeting/${workspaceId}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name,
          description,
          startAt,
          meetingId,
        },
      }),
    });

    if (!res.ok) {
      return toast({ title: 'Failed to create meeting' });
    }

    return toast({ title: 'Meeting Created' });
    // return meeting;
  }

  // Generate ICS file function
  async function generateICS({
    startTime,
    description,
    meetingLink,
  }: MeetingDetailsProps) {
    // const { startTime, description, meetingLink } = meetingDetails;

    const formattedStartTime = new Date(startTime)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    const formattedEndTime = new Date(
      new Date(startTime).getTime() + 60 * 60 * 1000,
    ) // 1-hour default duration
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    console.log(formattedStartTime, formattedEndTime);

    const icsData = `
      BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//Devtalk//EN
      CALSCALE:GREGORIAN
      BEGIN:VEVENT
      SUMMARY:Devtalk Meeting
      DESCRIPTION:${description}
      DTSTART:${formattedStartTime}
      DTEND:${formattedEndTime}
      LOCATION:${meetingLink}
      URL:${meetingLink}
      END:VEVENT
      END:VCALENDAR
    `;
    console.log(icsData);

    return new Blob([icsData], { type: 'text/calendar' });
  }

  // Download ICS file function
  async function downloadICS({
    startTime,
    description,
    meetingLink,
  }: MeetingDetailsProps) {
    const icsBlob = await generateICS({ startTime, description, meetingLink });
    const url = URL.createObjectURL(icsBlob);
    const a = document.createElement('a');
    if (!a) return;
    if (a) {
      console.log(a);
    }
    a.href = url;
    a.download = 'meeting.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!client || !user) return <Loader />;

  // Create Meeting function
  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);

      // Save meeting to DB
      await createMeetingDB(workspaceId, {
        name: `${meetingState}`,
        description: `${description}`,
        startAt: `${startsAt}`,
        meetingId: `${call.id}`,
      });

      toast({
        title: 'Meeting Created',
      });

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/meeting/${callDetail?.id}`;

  return (
    <section className="grid mt-20   grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        variant="primary"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        variant="orange"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        variant="purple"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        variant="yellow"
        handleClick={() => router.push(`/workspace/${workspaceId}/recordings`)}
      />

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-hidden"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            downloadICS({
              startTime: values.dateTime,
              description: values.description,
              meetingLink,
            });
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
