"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
// import { useWorkspaceStore } from "@/store/workspace";
// import { useGetCallsByTeam } from "@/hooks/useGetCallsbyTeam";
import { useCallback, useMemo, useRef } from "react";
import { useGetCallByTeamandId } from "@/hooks/useGetCallByTeamandId";

const COLORS = ["#0e0d85", "#00C49F", "#FFBB28", "#FF8042"];

export const WeeklyMeetingsChart = () => {
  // const { workspaceName } = useWorkspaceStore();.
  const { calls: TeamCall, isCallsLoading } = useGetCallByTeamandId();

  // Keep stable reference to date objects
  const dateRangeRef = useRef({
    startOfWeek: new Date(),
    endOfWeek: new Date(),
  });

  // Memoize date range calculation
  const getDateRange = useCallback(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  }, []);

  const { thisWeekCalls } = useMemo(() => {
    const { startOfWeek, endOfWeek } = getDateRange();
    dateRangeRef.current = { startOfWeek, endOfWeek };

    const filteredCalls = TeamCall.filter((call) => {
      const callDate = new Date(call.state.createdAt || 0);
      return callDate >= startOfWeek && callDate <= endOfWeek;
    });

    return {
      thisWeekCalls: filteredCalls,
      weekDates: { startOfWeek, endOfWeek },
    };
  }, [TeamCall, getDateRange]);

  // Stable data processing
  const data = useMemo(() => {
    const endedCalls = thisWeekCalls.filter((call) => call.state.endedAt);
    const totalCalls = thisWeekCalls.length;

    return [
      { name: "Completed Calls", value: endedCalls.length },
      { name: "Active/Pending", value: totalCalls - endedCalls.length },
    ];
  }, [thisWeekCalls]);

  if (isCallsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[200px] justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#0e0d85"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
