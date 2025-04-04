"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useWorkspaceStore } from "@/store/workspace";
import { useGetCallsByTeam } from "@/hooks/useGetCallsbyTeam";
import { useMemo } from "react";

const COLORS = ["#0e0d85", "#00C49F", "#FFBB28", "#FF8042"];

export const WeeklyMeetingsChart = () => {
  const { workspaceName } = useWorkspaceStore();
  const { calls: TeamCall, isCallsLoading } = useGetCallsByTeam(workspaceName!);

  const { thisWeekCalls } = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    endOfWeek.setHours(23, 59, 59, 999);

    const filteredCalls = TeamCall.filter((call) => {
      const callDate = new Date(call.state.createdAt || 0);
      return callDate >= startOfWeek && callDate <= endOfWeek;
    });

    return {
      thisWeekCalls: filteredCalls,
      weekDates: { startOfWeek, endOfWeek },
    };
  }, [TeamCall]);

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
    <div className="w-full h-[500px]">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Total Meetings: {thisWeekCalls.length}
      </h3>
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
