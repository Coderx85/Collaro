"use client";

import Loader from "@/components/Loader";
import { useGetCallsBySlug } from "@/hooks/useGetCallsBySlug";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  slug: string;
};

const MonthlyMeetingChart = (props: Props) => {
  const { data, isPending } = useGetCallsBySlug(props.slug);

  // Bucket meetings into weeks of the current month
  const { chartData, totalMeetings, maxMeetings, monthLabel } = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    // 5 buckets: Week 1 (1-7), Week 2 (8-14), Week 3 (15-21), Week 4 (22-28), Week 5 (29-end)
    const buckets = [0, 0, 0, 0, 0];

    if (data && data.length > 0) {
      data.forEach((meeting: any) => {
        const date = new Date(meeting.createdAt || meeting.startTime);
        if (date.getFullYear() === year && date.getMonth() === month) {
          const weekIndex = Math.floor((date.getDate() - 1) / 7); // 0..4
          buckets[weekIndex] = (buckets[weekIndex] || 0) + 1;
        }
      });
    }

    const chartData = buckets.map((count, idx) => ({
      week: `Week ${idx + 1}`,
      meetings: count,
    }));

    const totalMeetings = buckets.reduce((s, v) => s + v, 0);
    const maxMeetings = Math.max(...buckets, 1);
    const monthLabel = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    return { chartData, totalMeetings, maxMeetings, monthLabel };
  }, [data]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (!chartData || chartData.length === 0 || totalMeetings === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <p className="text-lg font-medium">No meetings this month</p>
        <p className="text-sm">
          Meetings in {monthLabel} will appear once created
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Meetings — {monthLabel}</h3>
        <p className="text-sm text-muted-foreground">
          Total this month: {totalMeetings} meetings
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey="meetings"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, maxMeetings + 1]}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [`${value} meetings`, "Count"]}
              contentStyle={{ backgroundColor: "var(--color-chart-1)" }}
              itemStyle={{ color: "var(--color-primary)" }}
              wrapperStyle={{ borderRadius: 6 }}
            />
            <Bar
              dataKey="meetings"
              fill="var(--color-primary)"
              radius={6}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyMeetingChart;
