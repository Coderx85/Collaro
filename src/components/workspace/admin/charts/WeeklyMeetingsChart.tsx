"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import React, { useMemo, useState, Suspense } from "react";
import { useGetCallByTeamandId } from "@/hooks/useGetCallByTeamandId";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";

const sanitizeKey = (key: string) =>
  key.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();

const defaultConfig = {
  mon: { label: "Mon", color: "#0e0d85" },
  tue: { label: "Tue", color: "#00C49F" },
  wed: { label: "Wed", color: "#FFBB28" },
  thu: { label: "Thu", color: "#FF8042" },
  fri: { label: "Fri", color: "#6F42C1" },
  sat: { label: "Sat", color: "#E11D48" },
  sun: { label: "Sun", color: "#0ea5e9" },
  w1: { label: "Week 1", color: "#0e0d85" },
  w2: { label: "Week 2", color: "#00C49F" },
  w3: { label: "Week 3", color: "#FFBB28" },
  w4: { label: "Week 4", color: "#FF8042" },
  w5: { label: "Week 5", color: "#6F42C1" },
};

function buildWeeklyData(calls: any[]) {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const key = label.slice(0, 3).toLowerCase();
    return { key, label };
  });

  const map = new Map(days.map((d) => [d.key, 0]));

  calls.forEach((call) => {
    const dt = new Date(call.state?.createdAt || 0);
    const key = dt
      .toLocaleDateString("en-US", { weekday: "short" })
      .slice(0, 3)
      .toLowerCase();
    if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
  });

  return days.map((d) => ({
    key: sanitizeKey(d.key),
    name: d.label,
    value: map.get(d.key) || 0,
  }));
}

function buildMonthlyData(calls: any[]) {
  // Group last 30 days into weeks (Week 1..Week 5)
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 29);
  start.setHours(0, 0, 0, 0);

  // Create week buckets
  const buckets: {
    key: string;
    label: string;
    start: Date;
    end: Date;
    value: number;
  }[] = [];
  for (let i = 0; i < 5; i++) {
    const s = new Date(start);
    s.setDate(start.getDate() + i * 7);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    buckets.push({
      key: `w${i + 1}`,
      label: `Week ${i + 1}`,
      start: s,
      end: e,
      value: 0,
    });
  }

  calls.forEach((call) => {
    const dt = new Date(call.state?.createdAt || 0);
    if (dt < start) return;
    for (const b of buckets) {
      if (dt >= b.start && dt <= b.end) {
        b.value += 1;
        break;
      }
    }
  });

  return buckets.map((b) => ({
    key: sanitizeKey(b.key),
    name: b.label,
    value: b.value,
  }));
}

const ChartLoader = ({
  message = "Loading chart...",
}: {
  message?: string;
}) => (
  <div className="h-[300px] w-full flex items-center justify-center">
    <div className="animate-pulse">{message}</div>
  </div>
);

const ChartEmpty = ({
  message = "No meeting data available",
}: {
  message?: string;
}) => (
  <div className="h-[300px] w-full flex items-center justify-center">
    <p>{message}</p>
  </div>
);

const ChartInner = ({ scope = "weekly" }: { scope?: "weekly" | "monthly" }) => {
  const { calls: TeamCall, isCallsLoading } = useGetCallByTeamandId();

  const data = useMemo(() => {
    if (!TeamCall) return [];
    return scope === "weekly"
      ? buildWeeklyData(TeamCall)
      : buildMonthlyData(TeamCall);
  }, [TeamCall, scope]);

  const payload = data.map((d) => ({
    value: d.value,
    dataKey: d.key,
    name: d.name,
    color: `var(--color-${d.key})`,
    payload: { ...d, strokeDasharray: 0 },
  }));

  if (isCallsLoading) return <ChartLoader />;
  if (!TeamCall || TeamCall.length === 0) return <ChartEmpty />;

  return (
    <div className="h-[300px] w-full">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        {scope === "weekly"
          ? "Weekly meeting distribution"
          : "Monthly meeting distribution"}
      </h3>
      <ChartContainer config={defaultConfig}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${Math.round(percent * 100)}%`
              }
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent payload={payload} />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export const WeeklyMeetingsChart = () => {
  const [scope, setScope] = useState<"weekly" | "monthly">("weekly");

  return (
    <Suspense fallback={<ChartLoader />}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${scope === "weekly" ? "bg-primary text-white" : "bg-muted"}`}
              onClick={() => setScope("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 rounded ${scope === "monthly" ? "bg-primary text-white" : "bg-muted"}`}
              onClick={() => setScope("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>
        <ChartInner scope={scope} />
      </div>
    </Suspense>
  );
};
