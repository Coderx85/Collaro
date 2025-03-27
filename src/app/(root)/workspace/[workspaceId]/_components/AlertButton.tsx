"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useWorkspaceStore } from "@/store/workspace";

const AlertButton = () => {
  const [hasActiveMeeting, setHasActiveMeeting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const client = useStreamVideoClient();
  const { workspaceId } = useWorkspaceStore();

  useEffect(() => {
    async function checkForActiveMeetings() {
      if (!client || !workspaceId) {
        setIsLoading(false);
        return;
      }

      try {
        // Query for active calls in this workspace
        const { calls } = await client.queryCalls({
          filter_conditions: {
            team: workspaceId,
            ended_at: null, // Only active calls (not ended)
          },
        });

        // Set active meeting status based on results
        setHasActiveMeeting(calls.length > 0);
      } catch (error) {
        console.error("Failed to check for active meetings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkForActiveMeetings();

    // Set up polling interval to check for active meetings
    const intervalId = setInterval(checkForActiveMeetings, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [client, workspaceId]);

  return (
    <Button
      variant={!hasActiveMeeting ? "inactive" : "active"}
      className='font-bold w-full'
      disabled={isLoading}
    >
      {isLoading
        ? "Checking..."
        : !hasActiveMeeting
          ? "No Active Meeting"
          : "Active Meeting"}
    </Button>
  );
};

export default AlertButton;
