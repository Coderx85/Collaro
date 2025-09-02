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
import { useCallback, useMemo, Suspense } from "react";
import { useGetCallByTeamandId } from "@/hooks/useGetCallByTeamandId";

const ChartContent = () => {
  const { calls: TeamCall, isCallsLoading } = useGetCallByTeamandId();

  // Memoize date calculations
  const getDaysArray = useCallback(() => {
    const days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        return d;
      })
      .reverse();
    return days;
  }, []);

  // Memoize chart data processing
  const { dailyData, maxMeetings } = useMemo(() => {
    const days = getDaysArray();
    const dateMap = new Map();

    // Initialize map with dates
    days.forEach((date) => {
      dateMap.set(date.toISOString().split("T")[0], 0);
    });

    // Single pass count
    TeamCall.forEach((call) => {
      const callDate = new Date(call.state.createdAt || 0)
        .toISOString()
        .split("T")[0];
      if (dateMap.has(callDate)) {
        dateMap.set(callDate, dateMap.get(callDate) + 1);
      }
    });

    // Transform to chart data
    const data = Array.from(dateMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      meetings: count,
      fullDate: date, // Keep full date for tooltip
    }));

    return {
      dailyData: data,
      maxMeetings: Math.max(...data.map((d) => d.meetings)),
    };
  }, [TeamCall, getDaysArray]);

  // Memoize chart config
  const chartConfig = useMemo(
    () => ({
      xAxis: {
        tickFormatter: (value: string) => value,
        style: { fontSize: "18px" },
        interval: 0,
        dx: -10,
        dy: 10,
      },
      yAxis: {
        domain: [0, maxMeetings + 1],
        allowDecimals: false,
      },
    }),
    [maxMeetings],
  );

  if (isCallsLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-pulse">Loading meeting statistics...</div>
      </div>
    );
  }

  if (!TeamCall || TeamCall.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>No meeting data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Daily Meeting Count
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            {...chartConfig.xAxis}
          />
          <YAxis
            dataKey={"meetings"}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickCount={5}
            {...chartConfig.yAxis}
          />
          <Tooltip
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value) => [`${value} meetings`, "Count"]}
            itemStyle={{ color: "var(--color-primary)" }}
            contentStyle={{ backgroundColor: "var(--color-chart-1)" }}
            wrapperStyle={{ borderRadius: "6px" }}
            labelStyle={{ color: "var(--chart-1)" }}
          />
          <Bar
            dataKey="meetings"
            fill="var(--color-primary)"
            radius={4}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DailyMeetingsChart = () => {
  return (
    <Suspense
      fallback={
        <div className="h-[300px] w-full flex items-center justify-center">
          <div className="animate-pulse">Loading chart...</div>
        </div>
      }
    >
      <ChartContent />
    </Suspense>
  );
};
