import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;

      setIsLoading(true);

      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  const now = new Date();

  // Refactored to avoid destructuring which can cause errors if state is undefined
  const endedCalls =
    calls?.filter((call: Call) => {
      if (!call.state) return false;
      const { startsAt, endedAt } = call.state;
      return (startsAt && new Date(startsAt) < now) || !!endedAt;
    }) || [];

  const upcomingCalls =
    calls?.filter((call: Call) => {
      if (!call.state) return false;
      const { startsAt } = call.state;
      return startsAt && new Date(startsAt) > now;
    }) || [];

  return { endedCalls, upcomingCalls, callRecordings: calls || [], isLoading };
};
