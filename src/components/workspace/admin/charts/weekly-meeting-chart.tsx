"use client";

import { useGetCallsBySlug } from "@/hooks/useGetCallsBySlug";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "@/components/Loader";
import { dayNames } from "@/constants";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const WeeklyMeetingsChart = ({ slug }: { slug: string }) => {
  const { data, isPending } = useGetCallsBySlug(slug);

  // Process data to show meetings by day of week
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const meetingsByDay: Record<string, number> = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    // Count meetings by day of week
    data.forEach((meeting: any) => {
      const date = new Date(meeting.createdAt || meeting.startTime);
      const dayName = dayNames[date.getDay()];
      meetingsByDay[dayName]++;
    });

    // Convert to chart format and filter out empty days
    return Object.entries(meetingsByDay)
      .filter(([_, count]) => count > 0)
      .map(([day, count]) => ({
        name: day,
        value: count,
      }));
  }, [data]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <p className="text-lg font-medium">No meetings yet</p>
        <p className="text-sm">Meetings will appear here once created</p>
      </div>
    );
  }

  const totalMeetings = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Meetings by Day</h3>
        <p className="text-sm text-muted-foreground">
          Total this week: {totalMeetings} meetings
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} meetings`, "Count"]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyMeetingsChart;
