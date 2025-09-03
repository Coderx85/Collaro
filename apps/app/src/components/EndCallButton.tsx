"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "@repo/design/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const [isEnding, setIsEnding] = useState(false);
  const { organization } = useOrganization();
  const workspaceId = organization?.id;

  if (!call)
    throw new Error(
      "useStreamCall must be used within a StreamCall component.",
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    if (isEnding) return;

    try {
      setIsEnding(true);

      // Update the meeting end time in the database
      const res = await fetch(`/api/meeting/${call.id}/end`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update meeting end time");
      }

      // await call.stopTranscription();
      // End the call for everyone
      await call.endCall();
      toast.success("Call ended");
      router.push(`/workspace/${workspaceId}`);
    } catch (error: unknown) {
      toast.error(
        `Failed to end call: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      // console.error("Error ending call:", error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <Button
      onClick={endCall}
      disabled={isEnding}
      className={`
        gap-2 px-4 py-2
        ${isEnding ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}
      `}
      variant={"destructive"}
    >
      <Phone className="h-4 w-4" />
      {isEnding ? "Ending call..." : "End call for everyone"}
    </Button>
  );
};

export default EndCallButton;
