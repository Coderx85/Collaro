"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call } from "@stream-io/video-react-sdk";
import CallList from "./CallList";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IconCalendarEvent, IconCalendarCheck } from "@tabler/icons-react";

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

  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;
  const meetingsOnSelectedDate = selectedDateKey
    ? meetingsByDay[selectedDateKey]?.length || 0
    : 0;

  const totalMeetings = upcomingCalls.length;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-6 pb-12 pt-6 md:px-10 md:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-6rem] h-96 w-96 rounded-full bg-primary/8 blur-[160px]" />
        <div className="absolute bottom-[-6rem] left-0 h-96 w-96 rounded-full bg-secondary/8 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-8">
        {/* Shared Header */}
        <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm md:p-8">
          <div className="relative grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {totalMeetings} upcoming {totalMeetings === 1 ? "meeting" : "meetings"}
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Meeting Calendar
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                {filterByDate
                  ? `${meetingsOnSelectedDate} meeting${meetingsOnSelectedDate !== 1 ? "s" : ""} on ${format(selectedDate!, "MMMM d, yyyy")}`
                  : `Schedule, manage, and stay on top of your upcoming calls.`}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-border/50 bg-background/60 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconCalendarEvent className="size-4" />
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {meetingDays.length} day{meetingDays.length !== 1 ? "s" : ""} with meetings
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Across your calendar.
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-border/50 bg-background/60 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <IconCalendarCheck className="size-4" />
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Quick scheduling
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Pick a date, see your calls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm md:p-5">
              <div className="pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-foreground">Calendar</p>
                  {filterByDate && (
                    <Button
                      onClick={clearDateFilter}
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-full px-3 text-xs transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                numberOfMonths={1}
                className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-foreground",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-border/50 transition-opacity duration-150",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 rounded-md",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-accent transition-colors duration-150",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
                modifiers={{
                  meetings: meetingDays,
                }}
                modifiersClassNames={{
                  meetings: "font-semibold text-primary bg-primary/10",
                }}
              />

              {/* Meeting Count Info */}
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    {format(selectedDate, "MMM d, yyyy")}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-3xl font-semibold text-primary">
                      {meetingsOnSelectedDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      meeting{meetingsOnSelectedDate !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-3">
                  Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Total Meetings
                    </span>
                    <span className="font-medium text-foreground">
                      {totalMeetings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Days with Meetings
                    </span>
                    <span className="font-medium text-foreground">
                      {meetingDays.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meetings List Section */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm md:p-8">
              <div className="[&_input[type='date']]:hidden">
                <CallList type="upcoming" selectedDate={filterByDate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
