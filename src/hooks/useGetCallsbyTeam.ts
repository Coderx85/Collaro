import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCallsByTeam = (team: string | string[]) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isCallsLoading, setIsCallsLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCalls = async () => {
      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          filter_conditions: { team },
        });

        setCalls(calls);
        setIsCallsLoading(false);
      } catch (error) {
        console.error(error);
        setIsCallsLoading(false);
      }
    };

    loadCalls();
  }, [client, team]);

  return { calls, isCallsLoading };
};
