"use client";

import { useState } from "react";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import Loader from "./Loader";
import ReactDatePicker from "react-datepicker";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useWorkspaceStore } from "@/store/workspace";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const MeetingTypeList = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();
  const { workspaceName, members, workspaceId } = useWorkspaceStore();

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const [showMemberSelection, setShowMemberSelection] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Format members for selection dialog
  const formatMembers = () => {
    return (
      members?.map((member) => {
        if (typeof member === "object") {
          return {
            id: member.id,
            name: member.userName || "Unknown Member",
          };
        }
        return { id: member, name: member };
      }) || []
    );
  };

  const formattedMembers = formatMembers();

  // Toggle member selection
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  // Handle new meeting button click
  const handleNewMeeting = () => {
    // Pre-select all members by default
    const allMemberIds = formattedMembers
      .filter((member) => {
        const memberId = member.id;
        return memberId !== user?.id;
      })
      .map((member) => member.id);

    setSelectedMembers(allMemberIds);
    setShowMemberSelection(true);
  };

  // Handle start meeting after member selection
  const handleStartMeeting = () => {
    setShowMemberSelection(false);
    setMeetingState("isInstantMeeting");
    createMeeting();
  };

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
    const res = await fetch(`/api/meeting/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          workspaceId,
          name,
          description,
          startAt,
          meetingId,
        },
      }),
    });

    if (!res.ok) {
      return toast({ title: "Failed to create meeting" });
    }

    return toast({ title: "Meeting Created" });
  }

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
        console.error("Error creating call:", error);
        toast({ title: "Failed to create meeting" });
        return;
      }

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      const isScheduled = meetingState === "isScheduleMeeting";

      // Get meeting members
      const potentialMembers =
        showMemberSelection || meetingState === "isInstantMeeting"
          ? selectedMembers
          : members?.map((member) =>
              typeof member === "object" ? member.id : member,
            ) || [];

      // Verify members exist before creating call

      try {
        const response = await call.getOrCreate({
          ring: true,
          data: {
            starts_at: startsAt,
            custom: {
              description,
              scheduled: isScheduled,
            },
            team: workspaceName!,
            members: [
              { user_id: user.id, role: "host" },
              ...potentialMembers.map((memberId: any) => ({
                user_id: memberId,
                role: "guest",
              })),
            ],
          },
          members_limit: potentialMembers.length + 1,
        });

        if (!response) throw new Error("Failed to create meeting");
        setCallDetail(call);

        // Only proceed with DB operations if call creation was successful
        await createMeetingDB(workspaceId!, {
          name: `${meetingState}`,
          description: `${description}`,
          startAt: `${startsAt}`,
          meetingId: `${call.id}`,
        });

        if (isScheduled && members && members.length > 0) {
          await createNotifications(call.id, description, startsAt);
        }

        toast({ title: "Meeting Created" });

        if (!values.description) {
          router.push(`/meeting/${call.id}`);
        }
      } catch (error) {
        console.error("Error in call.getOrCreate:", error);
        toast({ title: "Failed to create meeting" });
      }
    } catch (error) {
      console.error("Error in createMeeting:", error);
      toast({ title: "Failed to create meeting" });
    }
  };

  // Helper function to create notifications
  const createNotifications = async (
    callId: string,
    description: string,
    startsAt: string,
  ) => {
    try {
      await fetch("/api/notifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Upcoming Meeting",
          message: description || "A meeting has been scheduled",
          meetingId: callId,
          workspaceId: workspaceId,
          scheduledFor: startsAt,
          userIds: members,
        }),
      });
    } catch (error) {
      console.error("Failed to create notifications:", error);
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/meeting/${callDetail?.id}`;

  return (
    <>
      <section className="grid mt-20 gap-5 mgrid-cols-2 xl:grid-cols-4">
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          variant="primary"
          description="Start an instant meeting"
          handleClick={handleNewMeeting}
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

      {/* Member Selection Dialog */}
      <Dialog open={showMemberSelection} onOpenChange={setShowMemberSelection}>
        <DialogContent className="flex flex-col gap-4 max-w-md border-none bg-dark-1 px-6 py-9 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Select Members for Instant Meeting
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto py-2 space-y-2"></div>
          {formattedMembers.length > 0 ? (
            formattedMembers
              .filter((member) => member.id !== user?.id) // Don't show current user
              .map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 gap-2 py-2 px-1"
                >
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => toggleMemberSelection(member.id)}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="text-white cursor-pointer"
                  >
                    {member.name}
                  </label>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-400">
              No other members in this workspace
            </p>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowMemberSelection(false)}
              className="border-gray-500 text-white hover:text-white"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleStartMeeting}
            >
              Start Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingTypeList;
