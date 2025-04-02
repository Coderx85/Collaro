"use client";

import Loader from "./Loader";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { Call, CallRecording } from "@stream-io/video-react-sdk";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 3);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 2500);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, searchTerm]);

  useEffect(() => {
    const fetchRecordings = async (): Promise<void> => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const getCalls = (): (Call | CallRecording)[] => {
    switch (type) {
      case "ended":
        return endedCalls || [];
      case "recordings":
        return recordings || [];
      case "upcoming":
        return upcomingCalls || [];
      default:
        return [];
    }
  };

  const getNoCallsMessage = (): string => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  // Create a safeguard to ensure calls is always an array
  const calls = getCalls();
  const safeCallsArray = Array.isArray(calls) ? calls : [];

  // Extra safeguard to prevent filter on undefined
  const filteredCalls = safeCallsArray.filter((meeting) => {
    if (!meeting) return false;

    const title =
      (meeting as Call)?.state?.custom?.description ||
      (meeting as CallRecording)?.filename ||
      "";

    // Ensure we don't call toLowerCase on undefined
    const searchLower = debouncedSearchTerm?.toLowerCase() || "";
    return title.toLowerCase().includes(searchLower);
  });

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold bg-gradient-to-r from-[#FF0080] to-[#FF8C00] bg-clip-text text-transparent">
        {type === "ended"
          ? "Previous Meetings"
          : type === "upcoming"
            ? "Upcoming Meetings"
            : "Recordings"}
      </h1>

      {/* Search Box */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        {isSearching && (
          <div className="absolute right-3 top-2 animate-spin">⏳</div>
        )}
      </div>

      {/* Display Skeleton if Searching */}
      {isSearching ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[250px] bg-zinc-950/90 dark:bg-dark-1 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredCalls.length > 0 ? (
            filteredCalls.map((meeting: Call | CallRecording) => (
              <MeetingCard
                key={(meeting as Call).id}
                icon={
                  type === "ended"
                    ? "/icons/previous.svg"
                    : type === "upcoming"
                      ? "/icons/upcoming.svg"
                      : "/icons/recordings.svg"
                }
                title={
                  (meeting as Call).state?.custom?.description ||
                  (meeting as CallRecording).filename?.substring(0, 20) ||
                  "No Description"
                }
                date={
                  (meeting as Call).state?.startsAt?.toLocaleString() ||
                  (meeting as CallRecording).start_time?.toLocaleString()
                }
                isPreviousMeeting={type === "ended"}
                link={
                  type === "recordings"
                    ? (meeting as CallRecording).url
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                }
                buttonIcon1={
                  type === "recordings" ? "/icons/play.svg" : undefined
                }
                buttonText={type === "recordings" ? "Play" : "Start"}
                handleClick={
                  type === "recordings"
                    ? () => router.push(`${(meeting as CallRecording).url}`)
                    : () => router.push(`/meeting/${(meeting as Call).id}`)
                }
              />
            ))
          ) : (
            <h1 className="text-2xl font-bold text-black/85 dark:text-white">
              {getNoCallsMessage()}
            </h1>
          )}
        </div>
      )}
    </>
  );
};

export default CallList;
