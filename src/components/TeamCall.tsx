"use client";
import { useGetCallsByTeam } from "@/hooks/useGetCallsbyTeam";
import { useWorkspaceStore } from "@/store/workspace";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  Users,
  Clock,
  User,
  LucidePhoneOff,
  LucidePhoneCall,
  Video,
  Calendar,
  Clock3,
  AlarmClock,
  CheckCircle2,
  BarChart3,
  ClipboardList,
  Hourglass,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Legend,
  Tooltip as RechartTooltip,
  // AreaChart, Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TeamCall = () => {
  const { data: session } = useSession();
  const { workspaceName } = useWorkspaceStore();
  const { calls, isCallsLoading } = useGetCallsByTeam(workspaceName as string);

  // Function to calculate and format call duration
  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "In progress";

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
  };

  // Function to determine call status
  const getCallStatus = (call: any) => {
    if (call.state.endedAt) {
      return {
        label: "Ended",
        color: "destructive",
        icon: <LucidePhoneOff className="h-4 w-4 mr-1" />,
      };
    } else if (
      call.state.startedAt &&
      new Date(call.state.startedAt) < new Date()
    ) {
      return {
        label: "Active",
        color: "success",
        icon: <LucidePhoneCall className="h-4 w-4 mr-1" />,
      };
    } else if (call.state.custom?.scheduled) {
      return {
        label: "Scheduled",
        color: "warning",
        icon: <AlarmClock className="h-4 w-4 mr-1" />,
      };
    } else {
      return {
        label: "Created",
        color: "secondary",
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
      };
    }
  };

  // Process data for visualizations
  const visualizationData = useMemo(() => {
    if (!calls || calls.length === 0) return null;

    // Call status distribution
    const statusCounts = {
      Active: 0,
      Ended: 0,
      Scheduled: 0,
      Created: 0,
    };

    // Call duration data
    const durationData = [];

    // Member participation
    const memberParticipation = new Map();

    // Date distribution
    const dateDistribution = new Map();

    // Weekly distribution
    const weeklyDistribution = new Map();

    // Monthly distribution
    const monthlyDistribution = new Map();

    // Meeting type distribution
    const meetingTypeCount = {
      Scheduled: 0,
      Instant: 0,
    };

    // Duration categories
    const durationCategories = {
      "< 15 mins": 0,
      "15-30 mins": 0,
      "30-60 mins": 0,
      "> 60 mins": 0,
      "In Progress": 0,
    };

    // Time of day distribution
    const timeOfDayCount = {
      "Morning (6-12)": 0,
      "Afternoon (12-17)": 0,
      "Evening (17-22)": 0,
      "Night (22-6)": 0,
    };

    // Get current date for calculations
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    console.log("Current Day:", currentDay);
    // const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    // const currentYear = currentDate.getFullYear();

    // Month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Day names
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (const call of calls) {
      // Count statuses
      const status = getCallStatus(call);
      statusCounts[status.label as keyof typeof statusCounts]++;

      // Meeting type categorization
      if (call.state.custom?.scheduled) {
        meetingTypeCount.Scheduled++;
      } else {
        meetingTypeCount.Instant++;
      }

      // Calculate duration for ended calls and categorize
      if (call.state.startedAt) {
        const startDate = new Date(call.state.startedAt);

        // Time of day categorization

        const hour = startDate.getHours();
        if (hour >= 6 && hour < 12) {
          timeOfDayCount["Morning (6-12)"]++;
        } else if (hour >= 12 && hour < 17) {
          timeOfDayCount["Afternoon (12-17)"]++;
        } else if (hour >= 17 && hour < 22) {
          timeOfDayCount["Evening (17-22)"]++;
        } else {
          timeOfDayCount["Night (22-6)"]++;
        }

        if (call.state.endedAt) {
          const start = startDate.getTime();
          const end = new Date(call.state.endedAt).getTime();
          const durationMinutes = Math.round((end - start) / (1000 * 60));

          // Duration categorization
          if (durationMinutes < 15) {
            durationCategories["< 15 mins"]++;
          } else if (durationMinutes >= 15 && durationMinutes < 30) {
            durationCategories["15-30 mins"]++;
          } else if (durationMinutes >= 30 && durationMinutes < 60) {
            durationCategories["30-60 mins"]++;
          } else {
            durationCategories["> 60 mins"]++;
          }

          durationData.push({
            id: call.id.slice(0, 8),
            duration: durationMinutes,
            title: call.state?.custom?.description || "Untitled Call",
          });
        } else {
          // Call is in progress
          durationCategories["In Progress"]++;
        }
      }

      // Count member participation
      call.state.members.forEach((member) => {
        const memberName = member.user.name || member.user.id.slice(0, 8);
        memberParticipation.set(
          memberName,
          (memberParticipation.get(memberName) || 0) + 1,
        );
      });

      // Time-based aggregations
      if (call.state.startedAt) {
        const callDate = new Date(call.state.startedAt);

        // Daily distribution
        const date = callDate.toLocaleDateString();
        dateDistribution.set(date, (dateDistribution.get(date) || 0) + 1);

        // Weekly distribution - group by day of week
        const dayOfWeek = dayNames[callDate.getDay()];
        weeklyDistribution.set(
          dayOfWeek,
          (weeklyDistribution.get(dayOfWeek) || 0) + 1,
        );

        // Monthly distribution - group by month
        const monthYear = `${monthNames[callDate.getMonth()]} ${callDate.getFullYear()}`;
        monthlyDistribution.set(
          monthYear,
          (monthlyDistribution.get(monthYear) || 0) + 1,
        );
      }
    }

    // Format for charts
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color:
        name === "Active"
          ? "#10b981"
          : name === "Ended"
            ? "#ef4444"
            : name === "Scheduled"
              ? "#f59e0b"
              : "#9ca3af",
    }));

    // Meeting type pie chart data
    const meetingTypeData = Object.entries(meetingTypeCount).map(
      ([name, value]) => ({
        name,
        value,
        color: name === "Scheduled" ? "#3b82f6" : "#8b5cf6",
      }),
    );

    // Duration categories pie chart data
    const durationCategoryData = Object.entries(durationCategories).map(
      ([name, value]) => ({
        name,
        value,
        color:
          name === "< 15 mins"
            ? "#10b981"
            : name === "15-30 mins"
              ? "#3b82f6"
              : name === "30-60 mins"
                ? "#8b5cf6"
                : name === "> 60 mins"
                  ? "#f59e0b"
                  : "#9ca3af", // In Progress
      }),
    );

    // Time of day pie chart data
    const timeOfDayData = Object.entries(timeOfDayCount).map(
      ([name, value]) => ({
        name,
        value,
        color:
          name === "Morning (6-12)"
            ? "#f59e0b" // Orange for morning
            : name === "Afternoon (12-17)"
              ? "#3b82f6" // Blue for afternoon
              : name === "Evening (17-22)"
                ? "#8b5cf6" // Purple for evening
                : "#1e293b", // Dark blue for night
      }),
    );

    const memberData = Array.from(memberParticipation.entries())
      .map(([name, count]) => ({ name, calls: count }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);

    const dateData = Array.from(dateDistribution.entries())
      .map(([date, count]) => ({ date, calls: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Last 14 days

    // Process weekly data - ensure all days are represented and in correct order
    const orderedDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weeklyData = orderedDays.map((day) => ({
      day,
      calls: weeklyDistribution.get(day) || 0,
    }));

    // Process monthly data - sort chronologically
    const monthlyData = Array.from(monthlyDistribution.entries())
      .map(([month, count]) => ({ month, calls: count }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");

        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
      })
      .slice(-6); // Last 6 months

    return {
      statusData,
      durationData,
      memberData,
      dateData,
      weeklyData,
      monthlyData,
      meetingTypeData,
      durationCategoryData,
      timeOfDayData,
    };
  }, [calls]);

  // Custom colors for charts
  const COLORS = [
    "#10b981",
    "#ef4444",
    "#f59e0b",
    "#9ca3af",
    "#3b82f6",
    "#8b5cf6",
  ];

  if (isCallsLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl text-black dark:text-white font-semibold tracking-tight">
          Workspace Calls
        </h2>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight dark:text-gray-100">
        Workspace Calls
      </h2>

      {calls.length === 0 ? (
        <Card className="text-center p-6 border dark:border-gray-700 dark:bg-gray-800/50">
          <CardContent>
            <p className="text-lg text-muted-foreground dark:text-gray-300">
              No calls available
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-250px)]">
          {/* Analytics Dashboard Section */}
          <div className="mb-8">
            <Card className="border dark:border-gray-700 dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <BarChart3 className="h-5 w-5" />
                  Call Analytics Dashboard
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Visual insights for your workspace calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="more-insights">
                      More Insights
                    </TabsTrigger>
                    <TabsTrigger value="duration">Call Duration</TabsTrigger>
                    <TabsTrigger value="members">
                      Member Participation
                    </TabsTrigger>
                    <TabsTrigger value="trends">Call Trends</TabsTrigger>
                    <TabsTrigger value="time-analysis">
                      Time Analysis
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-gray-200">
                      Call Status Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                      {visualizationData && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RPieChart>
                            <Pie
                              data={visualizationData.statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              innerRadius={60}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {visualizationData.statusData.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.color ||
                                      COLORS[index % COLORS.length]
                                    }
                                  />
                                ),
                              )}
                            </Pie>
                            <Legend />
                            <RechartTooltip
                              formatter={(value, name) => [
                                `${value} calls`,
                                name,
                              ]}
                            />
                          </RPieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
                      Total Calls: {calls.length}
                    </div>
                  </TabsContent>

                  <TabsContent value="more-insights" className="space-y-8">
                    {/* Meeting Type Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold dark:text-gray-200 flex items-center gap-2">
                          <ClipboardList className="h-5 w-5" />
                          Meeting Type Distribution
                        </h3>
                        <div className="h-[250px] w-full">
                          {visualizationData &&
                          visualizationData.meetingTypeData &&
                          visualizationData.meetingTypeData.some(
                            (d) => d.value > 0,
                          ) ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RPieChart>
                                <Pie
                                  data={visualizationData.meetingTypeData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                  }
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {visualizationData.meetingTypeData.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ),
                                  )}
                                </Pie>
                                <Legend />
                                <RechartTooltip
                                  formatter={(value, name) => [
                                    `${value} calls`,
                                    name,
                                  ]}
                                />
                              </RPieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <p className="text-muted-foreground dark:text-gray-400">
                                No meeting type data available
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
                          Distribution between scheduled and instant meetings
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="duration" className="space-y-4">
                    {/* Call Duration Categories */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold dark:text-gray-200 flex items-center gap-2">
                        <Hourglass className="h-5 w-5" />
                        Call Duration Categories
                      </h3>
                      <div className="h-[250px] w-full">
                        {visualizationData &&
                        visualizationData.durationCategoryData &&
                        visualizationData.durationCategoryData.some(
                          (d) => d.value > 0,
                        ) ? (
                          <>
                            <ResponsiveContainer width="100%" height="100%">
                              <RPieChart>
                                <Pie
                                  data={visualizationData.durationCategoryData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                  }
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {visualizationData.durationCategoryData.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ),
                                  )}
                                </Pie>
                                <Legend />
                                <RechartTooltip
                                  formatter={(value, name) => [
                                    `${value} calls`,
                                    name,
                                  ]}
                                />
                              </RPieChart>
                            </ResponsiveContainer>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground dark:text-gray-400">
                              No duration data available
                            </p>
                            <p className="text-muted-foreground dark:text-gray-400">
                              No duration data available
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
                        Breakdown of calls by duration categories
                      </div>
                    </div>

                    {/* Monthly Distribution */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold dark:text-gray-200 flex items-center gap-2">
                        Monthly Call Distribution
                      </h3>
                      <div className="h-[300px] w-full">
                        {visualizationData &&
                        visualizationData.monthlyData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={visualizationData.monthlyData}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 70,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#444"
                                opacity={0.2}
                              />
                              <XAxis
                                dataKey="month"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis allowDecimals={false} />
                              <RechartTooltip
                                formatter={(value) => [
                                  `${value} calls`,
                                  "Call Count",
                                ]}
                              />
                              <defs>
                                <linearGradient
                                  id="colorMonthly"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.2}
                                  />
                                </linearGradient>
                              </defs>
                              <Bar
                                dataKey="calls"
                                name="Monthly Calls"
                                fill="url(#colorMonthly)"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground dark:text-gray-400">
                              No monthly data available
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
                        Call volume by month for the last 6 months
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Call Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calls.map((call) => {
              const status = getCallStatus(call);
              const isMember = call.state.members.some(
                (member) => member.user.id === (session?.user?.id || ""),
              );
              const hasRecording = call.state.custom?.hasRecording || false;
              const meetingType = call.state.custom?.scheduled
                ? "Scheduled Meeting"
                : "Instant Meeting";

              return (
                <Card
                  key={call.id}
                  className="overflow-hidden border dark:border-gray-700 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-950 dark:shadow-md dark:shadow-gray-900/30"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      {call.state?.custom?.description ? (
                        <CardTitle className="dark:text-gray-100 truncate">
                          {call.state.custom.description}
                        </CardTitle>
                      ) : (
                        <CardTitle className="dark:text-gray-100">
                          Untitled Call
                        </CardTitle>
                      )}

                      <Badge
                        variant={status.color as any}
                        className="flex bg-transparent items-center"
                      >
                        {status.icon} {status.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <CardDescription className="flex items-center gap-1 dark:text-gray-400">
                        {call.state.startedAt && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {new Date(call.state.startedAt).toLocaleString()}
                          </div>
                        )}
                      </CardDescription>

                      <Badge
                        variant="outline"
                        className="text-xs dark:bg-transparent dark:text-gray-300 dark:border-gray-600"
                      >
                        {call.state.custom?.scheduled ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {meetingType}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Video className="h-3.5 w-3.5" /> {meetingType}
                          </div>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2 space-y-3">
                    {/* Duration Info */}
                    {call.state.startedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock3 className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span className="text-muted-foreground dark:text-gray-400">
                          Duration:{" "}
                          {formatDuration(
                            call.state.startedAt.toLocaleDateString(),
                            call.state.endedAt?.toLocaleDateString() || "",
                          )}
                        </span>
                      </div>
                    )}

                    {/* Members Section */}
                    {call.state.members && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                          <span className="text-sm text-muted-foreground dark:text-gray-400">
                            {call.state.members.length} members
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 ml-6 mt-1">
                          <TooltipProvider>
                            {call.state.members.slice(0, 3).map((member) => (
                              <Tooltip key={member.user.id}>
                                <TooltipTrigger>
                                  <Badge
                                    variant={"outline"}
                                    className="text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                  >
                                    {member.user.name || member.user.id}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Role: {member.role}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}

                            {call.state.members.length > 3 && (
                              <Badge
                                variant={"outline"}
                                className="text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                              >
                                +{call.state.members.length - 3} more
                              </Badge>
                            )}
                          </TooltipProvider>
                        </div>
                      </div>
                    )}

                    {/* Creator Info */}
                    {call.state.createdBy && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span className="text-sm text-muted-foreground dark:text-gray-400">
                          Created by: {call.state.createdBy.name}
                          {call.isCreatedByMe && (
                            <Badge
                              variant="outline"
                              className="ml-1 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            >
                              You
                            </Badge>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Created Time */}
                    {call.state.createdAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span className="text-sm text-muted-foreground dark:text-gray-400">
                          Created:{" "}
                          {new Date(call.state.createdAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Recording Badge */}
                    {hasRecording && (
                      <div className="flex items-center mt-1">
                        <Badge className="bg-red-500 text-white dark:bg-red-600 dark:text-white">
                          <Video className="h-3 w-3 mr-1" /> Recording Available
                        </Badge>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2">
                    {!call.state.endedAt || isMember ? (
                      <Link
                        href={`/meeting/${call.id}`}
                        className="w-full"
                        target={"_blank"}
                      >
                        <Button
                          variant={call.state.endedAt ? "secondary" : "default"}
                          className="w-full flex items-center justify-center dark:hover:bg-gray-600"
                        >
                          <LucidePhoneCall className="h-4 w-4 mr-1" />
                          {call.state.endedAt
                            ? "View Call Details"
                            : "Join Call"}
                        </Button>
                      </Link>
                    ) : (
                      <div className="w-full flex justify-center">
                        <Badge
                          variant={"destructive"}
                          className="px-3 py-1 flex items-center gap-1 dark:bg-red-900/70 dark:text-red-100 dark:hover:bg-red-900/90"
                        >
                          <LucidePhoneOff className="h-4 w-4 mr-1" />
                          Call Ended
                        </Badge>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default TeamCall;
