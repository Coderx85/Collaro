"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsData {
  name: string;
  totalMeetings: number;
  totalMembers: number;
  createdAt: string;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/workspace/analytics");
      const analytics = await res.json();
      setData(analytics);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Workspace Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" stroke="#000" className="bg-accent-foreground" />
          <YAxis stroke="#000" />
          <Tooltip />
          <Bar dataKey="totalMeetings" fill="#8884d8" name="Meetings" />
          <Bar dataKey="totalMembers" fill="#82ca9d" name="Members" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
