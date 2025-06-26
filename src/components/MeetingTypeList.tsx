"use client";

import { useState } from "react";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import Loader from "./Loader";
import ReactDatePicker from "react-datepicker";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { createMeetingAction } from "@/action/meeting.action";
import { CreateMeetingType } from "@/db";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

type meetingStateType =
  | "isScheduleMeeting"
  | "isJoiningMeeting"
  | "isInstantMeeting"
  | undefined;

const MeetingTypeList = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();
  // const { workspaceName, members, workspaceId } = useWorkspaceStore();
  const { organization } = useOrganization();
  const workspaceId = organization?.id;

  const [meetingState, setMeetingState] = useState<meetingStateType>(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();

  // async function createMeetingDB() {
  //   const { name, description, startAt, meetingId } = meetingDetails;
  //   const res = await fetch(`/api/meeting/new`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       data: {
  //         workspaceId,
  //         name,
  //         description,
  //         startAt,
  //         meetingId,
  //       },
  //     }),
  //   });

  //   if (!res.ok) {
  //     return toast({ title: "Failed to create meeting" });
  //   }

  //   return toast({ title: "Meeting Created" });
  // }

  if (!client || !user) return <Loader />;

  // Create Meeting function
  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }

      const id = v4();
      let call;

      try {
        call = client.call("default", id);
        if (!call) throw new Error("Failed to create meeting");
        setCallDetail(call);
      } catch (error) {
        // console.error("Error creating call:", error);
        toast({
          title: "Failed to create meeting",
          description:
            "Failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        });
        return;
      }

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      const isScheduled = meetingState === "isScheduleMeeting";
      // const workspaceName = organization?.name;

      try {
        const response = await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
              scheduled: isScheduled,
            },
            // members: [{user_id: user.id, role: "admin"}],
            // team: workspaceName!,
          },
        });

        if (!response) throw new Error("Failed to create meeting");
        setCallDetail(call);

        const meeting: CreateMeetingType = {
          id: call.id,
          description: values.description || "Instant Meeting",
          workspaceId: workspaceId!,
          hostedBy: user.id,
        };

        // Only proceed with DB operations if call creation was successful
        const meetDB = await createMeetingAction(meeting);
        if (!meetDB) {
          throw new Error("Failed to create meeting in database");
        }

        if (meetDB.error) {
          throw new Error(meetDB.error);
        }

        toast({
          title: "Meeting Created",
          description: "You can now join the meeting.",
        });

        if (!values.description) {
          router.push(`/meeting/${call.id}`);
        }
      } catch (error) {
        // console.error("Error in call.getOrCreate:", error);
        toast({
          title: "Failed to create meeting",
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } catch (error) {
      // console.error("Error in createMeeting:", error);
      toast({
        title: "Failed to create meeting",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/meeting/${callDetail?.id}`;

  return (
    <>
      <section className="grid mt-20 gap-5 mgrid-cols-2 xl:grid-cols-4">
        {" "}
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
          handleClick={() =>
            router.push(`/workspace/${workspaceId}/recordings`)
          }
        />
        {!callDetail ? (
          <MeetingModal
            isOpen={meetingState === "isScheduleMeeting"}
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
            isOpen={meetingState === "isScheduleMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Meeting Created"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({ title: "Link Copied" });
            }}
            image={"/icons/checked.svg"}
            buttonIcon="/icons/copy.svg"
            className="text-center"
            buttonText="Copy Meeting Link"
          />
        )}
        <MeetingModal
          isOpen={meetingState === "isJoiningMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Type the link here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={() => router.push(`/meeting/${values.link}`)}
        >
          <Input
            placeholder="Meeting link"
            onChange={(e) => setValues({ ...values, link: e.target.value })}
            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
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
    </>
  );
};

export default MeetingTypeList;
