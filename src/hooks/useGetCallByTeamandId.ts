import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useWorkspaceStore } from "@/store/workspace";
import { useUser } from "@clerk/nextjs";

export const useGetCallByTeamandId = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isCallsLoading, setIsCallsLoading] = useState(true);

  const client = useStreamVideoClient();
  const { workspaceName } = useWorkspaceStore();
  const { user } = useUser();
  const id = user?.id;
  useEffect(() => {
    if (!client) return;

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
        console.error(error);
        setIsCallsLoading(false);
      }
    };

    loadCall();
  }, [client, id, workspaceName]);

  return { calls, isCallsLoading };
};
