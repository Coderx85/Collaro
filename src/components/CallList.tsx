"use client";

import Loader from "./Loader";
import { useEffect, useState, useRef } from "react";
import MeetingCard from "./MeetingCard";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { FaSearch } from "react-icons/fa";
import { getFormattedDate } from "@/hooks/getFormatDate";

const MAX_CARDS = 6;

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 3);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const clearSearch = () => {
    setSearchTerm("");
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Show loading spinner when searching
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 2500);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, searchTerm]);

  // Fetch recordings when type is "recordings"
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

  // Filter calls based on type
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

  // Get message when no calls are available
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

  // Get calls based on type
  const calls = getCalls();
  const safeCallsArray = Array.isArray(calls) ? calls : [];

  // Filter calls based on search term
  const filteredCalls = safeCallsArray.filter((meeting) => {
    if (!meeting) return false;

    const title =
      (meeting as Call)?.state?.custom?.description ||
      (meeting as CallRecording)?.filename ||
      "";

    const searchLower = debouncedSearchTerm?.toLowerCase() || "";

    // Fix date extraction
    const meetingDate =
      getFormattedDate((meeting as Call)?.state?.startsAt) ||
      getFormattedDate((meeting as CallRecording)?.start_time) ||
      "";

    const matchDate = selectedDate ? meetingDate === selectedDate : true;
    const matchTitle = title.toLowerCase().includes(searchLower);
    return matchTitle && matchDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCalls.length / MAX_CARDS);
  const startIndex = (currentPage - 1) * MAX_CARDS;
  const endIndex = startIndex + MAX_CARDS;
  const paginatedCalls = filteredCalls.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <h1 className="mb-5 text-4xl capitalize font-bold bg-linear-to-r from-[#FF0080] to-[#FF8C00] bg-clip-text text-transparent">
        {type === "ended"
          ? "Previous Meetings"
          : type === "upcoming"
            ? "Upcoming Meetings"
            : "Recordings"}
      </h1>

      {/* SearchBox */}
      <div className="mb-4 flex w-full group gap-2">
        <div className="relative flex w-4/5">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {!isSearching && !searchTerm && (
            <div className="absolute right-3 top-2">
              <FaSearch className="text-gray-500 backdrop-blur-lg" />
            </div>
          )}
          {searchTerm && !isSearching && (
            <Button
              hidden={!searchTerm}
              onClick={clearSearch}
              type={"button"}
              size={"icon"}
              className="absolute right-1 backdrop-blur-3xl top-1 hover:bg-transparent dark:bg-transparent text-white rounded-sm px-2 align-middle hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              ✕
            </Button>
          )}
          {isSearching && (
            <div className="absolute right-1 top-1 animate-spin backdrop-blur-lg ">
              ⏳
            </div>
          )}
        </div>
        <div className="relative flex w-1/5">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {selectedDate && (
            <Button
              onClick={() => setSelectedDate("")}
              type={"button"}
              size={"icon"}
              className="absolute right-1 top-1 hover:bg-transparent dark:bg-transparent text-white rounded-sm px-2 align-middle hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-200"
              aria-label="Clear date filter"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[250px] bg-zinc-950/90 dark:bg-dark-1 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredCalls.length > 0 ? (
              paginatedCalls.map((meeting: Call | CallRecording) => (
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

          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6 gap-3">
              {/* Back Button */}
              <Button
                onClick={goToPreviousPage}
                hidden={currentPage === 1}
                size={"icon"}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-md text-base ${
                  currentPage === 1
                    ? "bg-white/30 cursor-not-allowed"
                    : "bg-linear-to-r from-dark-2 to-dark-1 text-white hover:opacity-90"
                }`}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex space-x-2 gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    size={"icon"}
                    onClick={() => goToPage(index + 1)}
                    className={`w-8 h-8 rounded-md ${
                      currentPage === index + 1
                        ? "bg-linear-to-b from-primary dark:to-primary/25 to-black text-white"
                        : "dark:bg-linear-to-r dark:from-dark-2 dark:to-dark-1 text-white bg-black/50 hover:opacity-90"
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              {/* Next Button */}
              <Button
                onClick={goToNextPage}
                hidden={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-dark-2 to-dark-1 text-white hover:opacity-90"
                }`}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CallList;
