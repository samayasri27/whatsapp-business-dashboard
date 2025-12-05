"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const messageData = [
  { name: "Mon", sent: 120, delivered: 115, read: 98 },
  { name: "Tue", sent: 150, delivered: 145, read: 125 },
  { name: "Wed", sent: 180, delivered: 175, read: 155 },
  { name: "Thu", sent: 140, delivered: 135, read: 118 },
  { name: "Fri", sent: 200, delivered: 195, read: 175 },
  { name: "Sat", sent: 90, delivered: 88, read: 75 },
  { name: "Sun", sent: 110, delivered: 105, read: 92 },
];

const campaignData = [
  { name: "Summer Sale", value: 2458 },
  { name: "Welcome Series", value: 1234 },
  { name: "Product Launch", value: 5678 },
  { name: "Re-engagement", value: 892 },
];

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

export function MessageAnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={messageData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Line type="monotone" dataKey="sent" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="delivered" stroke="#14b8a6" strokeWidth={2} />
        <Line type="monotone" dataKey="read" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CampaignDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={campaignData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {campaignData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function WeeklyPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={messageData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="sent" fill="#10b981" radius={[8, 8, 0, 0]} />
        <Bar dataKey="delivered" fill="#14b8a6" radius={[8, 8, 0, 0]} />
        <Bar dataKey="read" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
