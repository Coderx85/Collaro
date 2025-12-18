import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useSession } from "@/lib/auth-client";
import { getCookie } from "cookies-next";

export const useGetCallByTeamandId = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isCallsLoading, setIsCallsLoading] = useState(true);

  const client = useStreamVideoClient();
  const { data: session } = useSession();

  // Get workspace name from cookie (same as before)
  const workspaceName = getCookie("workspaceName") as string | undefined;
  const id = session?.user?.id;

  useEffect(() => {
    if (!client || !id) return;

    const loadCall = async () => {
      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          filter_conditions: {
            team: { $eq: workspaceName },
            members: { $in: [id] },
          },
        });

        setCalls(calls);
        setIsCallsLoading(false);
      } catch (error) {
        setIsCallsLoading(false);
        throw new Error(`Failed to load calls: ${error}`);
      }
    };

    loadCall();
  }, [client, id, workspaceName]);

  return { calls, isCallsLoading };
};
