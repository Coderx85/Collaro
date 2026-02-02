"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call } from "@stream-io/video-react-sdk";
import CallList from "./CallList";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export function UpcomingCalendar() {
  const { upcomingCalls, isLoading } = useGetCalls();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [filterByDate, setFilterByDate] = React.useState<string>("");

  const meetingsByDay = upcomingCalls.reduce(
    (acc, meeting) => {
      if (meeting.state.startsAt) {
        const day = format(meeting.state.startsAt, "yyyy-MM-dd");
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(meeting);
      }
      return acc;
    },
    {} as Record<string, Call[]>,
  );

  const meetingDays = Object.keys(meetingsByDay).map((day) => new Date(day));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFilterByDate(format(date, "yyyy-MM-dd"));
    }
  };

  const clearDateFilter = () => {
    setFilterByDate("");
    setSelectedDate(new Date());
  };

  // Get count of meetings for selected date
  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;
  const meetingsOnSelectedDate = selectedDateKey
    ? meetingsByDay[selectedDateKey]?.length || 0
    : 0;

  // Get total upcoming meetings
  const totalMeetings = upcomingCalls.length;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-linear-to-r from-[#FF0080] to-[#FF8C00] bg-clip-text text-transparent">
          Meeting Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filterByDate
            ? `Showing ${meetingsOnSelectedDate} meeting${meetingsOnSelectedDate !== 1 ? "s" : ""} on ${format(selectedDate!, "MMMM d, yyyy")}`
            : `You have ${totalMeetings} upcoming meeting${totalMeetings !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="p-0 sticky top-20 h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Calendar</CardTitle>
                {filterByDate && (
                  <Button
                    onClick={clearDateFilter}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 px-4 pb-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                numberOfMonths={1}
                className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                modifiers={{
                  meetings: meetingDays,
                }}
                modifiersStyles={{
                  meetings: {
                    fontWeight: "bold",
                    backgroundColor: "rgba(255, 140, 0, 0.1)",
                    color: "#FF8C00",
                    borderRadius: "4px",
                  },
                }}
              />

              {/* Meeting Count Info */}
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">
                    {format(selectedDate, "MMM d, yyyy")}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-3xl font-bold text-[#FF8C00]">
                      {meetingsOnSelectedDate}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      meeting{meetingsOnSelectedDate !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Meetings
                    </span>
                    <span className="font-semibold text-foreground">
                      {totalMeetings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Days with Meetings
                    </span>
                    <span className="font-semibold text-foreground">
                      {meetingDays.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings List Section */}
        <div className="lg:col-span-3">
          <Card className="p-0">
            <CardContent className="p-6">
              {/* Pass the selected date filter to CallList */}
              <div className="[&_input[type='date']]:hidden">
                <CallList type="upcoming" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
