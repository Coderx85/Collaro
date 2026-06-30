"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HomeCard from "../calls/HomeCard";
import MeetingModal from "./MeetingModal";
import Loader from "../../Loader";
import ReactDatePicker from "react-datepicker";
import { type Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { CalendarExport } from "../../CalendarExport";
import { Label } from "../../ui/label";
import { createMeetingAction } from "@/action";
import { toast } from "sonner";
import { TWorkspaceSlug } from "@/types";
import { StreamClient } from "@/modules/stream/class";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

type MeetingTypeListProps = {
  workspaceSlug: TWorkspaceSlug;
}

const MeetingTypeList = ({ workspaceSlug }: MeetingTypeListProps) => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { data: session, isPending } = useSession();

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();

  if (isPending || !client || !session?.user) return <Loader />;
  
  const createMeeting = async () => {
    if (!client || !session?.user) return;
    if (!values.dateTime) {
      toast.error("Please select a date and time for the meeting");
      return;
    }
    const streamClient = StreamClient.getInstance();
    const startsAt =
      values.dateTime.toISOString() || new Date(Date.now()).toISOString();
    const description = values.description || "Instant Meeting";

    try {     
      const res = await createMeetingAction({
        title: description,
        description,
        startTime: new Date(startsAt),
        workspaceSlug,
      });
        
      if(!res.success) {
        console.error("Failed to create meeting:", res.error);
        toast.error("Failed to create meeting");
        return;
      }

      const createdAt = new Date(res.data.createdAt);
      
      const call = await streamClient.createTeamMeeting({ ...res.data, createdAt });
      if(!call) {
        toast.error("Failed to create meeting in the video service");
        return;
      }
      setCallDetail(call);      

      console.log("Meeting created successfully", res.data);
      toast.success("Meeting created successfully");

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/meeting/${callDetail?.id}`;

  return (
    <section className="grid mt-20 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        variant="primary"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        variant="orange"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        variant="purple"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />

      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        variant="yellow"
        handleClick={() => router.push(`/workspace/${workspaceSlug}/recordings`)}
      />

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <Label>Add a description</Label>
            <Textarea
              aria-label={"Description"}
              className="text-black/75 dark:text-white rounded-lg p-2 focus:outline-hidden border border-slate-700"
              placeholder={"Write a description"}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5 text-black/75 dark:text-white">
            <Label>Select Date and Time</Label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full text-black/75 dark:text-white rounded p-2 focus:outline-hidden"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success("Link copied to clipboard");
          }}
          image={"/icons/checked.svg"}
          buttonIcon="/icons/copy.svg"
          className="text-center text-black/75 dark:text-white"
          buttonText="Copy Meeting Link"
        >
          <div className="flex flex-col gap-4 items-center">
            <p className="text-sm text-sky-2">
              Meeting scheduled for {values.dateTime.toLocaleString()}
            </p>
            <div className="flex gap-2 flex-wrap justify-center w-full">
              <div className="w-full max-w-md rounded-lg border p-4 text-sky-2 shadow-sm">
                <div className="flex items-center justify-center mb-3 w-full">
                    <CalendarExport
                      meetingId={callDetail?.id || ""}
                      meetingTitle={values.description || "Collaro Meeting"}
                      startTime={values.dateTime}
                      endTime={
                        new Date(values.dateTime.getTime() + 60 * 60 * 1000)
                      }
                      description={
                        values.description || "Meeting scheduled via Collaro"
                      }
                      location="Online Meeting"
                      meetingLink={meetingLink}
                      workspaceId={String(workspaceSlug)}
                      hostedBy={session?.user?.name || "Collaro User"}
                      hostEmail={session?.user?.email || "user@collaro.com"}
                      attendees={[]}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border border-slate-700 w-full text-sky-2 hover:bg-slate-800/40 hover:border-sky-400"
                    />
                </div>
                <p className="text-xs text-slate-400 text-center wrap-break-word">
                  Link:{" "}
                  <span className="font-mono text-sm text-sky-2">
                    {meetingLink}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Label>Meeting Link</Label>
        <Input
          placeholder="Paste your Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-accent border-b-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
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
