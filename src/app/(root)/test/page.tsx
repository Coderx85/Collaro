"use client";

import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Calendar, Clock, Users2, Video, PhoneOff, Radio } from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";

const TestPage = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [calls, setCalls] = useState<Call[]>();
  const [data, setData] = useState<{
    calls: Call[];
    duration: string;
    next?: string;
    prev?: string;
  }>();

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;

      try {
        const res = await client.queryCalls({
          limit: 10,
          watch: true,
          sort: [{ field: "created_at", direction: -1 }],
        });

        setData(res);
        setCalls(res.calls);
      } catch (error) {
        console.error("Failed to load calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary' />
      </div>
    );

  return (
    <div className='flex flex-col space-y-4 p-6'>
      <h1 className='text-4xl font-bold'>Call History</h1>
      <Separator className='border-2 border-white/10' />

      {data?.calls.length === 0 && (
        <div className='text-center py-12 text-muted-foreground'>
          No calls found
        </div>
      )}

      <div className='grid gap-4'>
        {calls?.map((call) => (
          <div
            key={call.id}
            className={cn(
              "p-4 rounded-lg",
              "bg-gradient-to-br from-gray-900/50 to-gray-800/50",
              "border border-white/10 hover:border-primary/50",
              "transition-all duration-200",
            )}
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                {call.type === "video" ? (
                  <Video className='h-5 w-5 text-primary' />
                ) : (
                  <Radio className='h-5 w-5 text-primary' />
                )}
                <h3 className='text-lg font-semibold'>
                  {call.type.charAt(0).toUpperCase() + call.type.slice(1)} Call
                </h3>
              </div>
              <span className='text-sm text-muted-foreground'>
                ID: {call.id.slice(0, 8)}
              </span>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {formatDistance(new Date(call.state.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {formatDuration(
                    call.state.createdAt,
                    call.state.endedAt
                      ? new Date(call.state.endedAt)
                      : undefined,
                  )}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <Users2 className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {call.state.participantCount} participants
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <PhoneOff className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {call.state.endedAt ? "Ended" : "Active"}
                </span>
              </div>
            </div>

            {call.state.recording && (
              <div className='mt-4 flex items-center gap-2'>
                <span className='text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500'>
                  Recording Available
                </span>
              </div>
            )}
          </div>
        ))}

        {calls?.length === 0 && (
          <div className='text-center py-12 text-muted-foreground'>
            No calls found
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;

function formatDuration(start: Date, end?: Date): string {
  if (!end) return "Ongoing";

  const diff = end.getTime() - start.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
