"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWorkspaceStore } from "@/store/workspace";
import { useGetCallsByTeam } from "@/hooks/useGetCallsbyTeam";
import { useMemo } from "react";

export const DailyMeetingsChart = () => {
  const { workspaceName } = useWorkspaceStore();
  const { calls: TeamCall, isCallsLoading } = useGetCallsByTeam(workspaceName!);

  const { dailyData } = useMemo(() => {
    // Calculate last 7 days once
    const days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();

    // Create a map for faster lookups
    const callCountMap = days.reduce(
      (acc, date) => {
        acc[date] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count meetings in a single pass
    TeamCall.forEach((call) => {
      const callDate = new Date(call.state.createdAt || 0)
        .toISOString()
        .split("T")[0];
      if (callCountMap.hasOwnProperty(callDate)) {
        callCountMap[callDate]++;
      }
    });

    // Transform data for chart
    const data = days.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      meetings: callCountMap[date],
    }));

    return { last7Days: days, dailyData: data };
  }, [TeamCall]);

  if (isCallsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[500px] w-">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Daily Meeting Count
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyData}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="meetings" fill="#0e0d85" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
