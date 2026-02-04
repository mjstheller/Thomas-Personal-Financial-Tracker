"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "#0071e3",
  "#30d158",
  "#5ac8fa",
  "#ff9f0a",
  "#bf5af2",
  "#ff375f",
  "#64d2ff",
  "#af52de",
];

interface MonthlyBarProps {
  data: { month: string; total: number }[];
}

export function MonthlyExpensesBarChart({ data }: MonthlyBarProps) {
  return (
    <div className="w-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px]">
        <h3 className="text-[15px] sm:text-base font-semibold text-[var(--foreground)] mb-3">
        Monthly spending (this year)
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--fill-quaternary)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--foreground)" }}
            tickFormatter={(v) => v.slice(0, 3)}
          />
          <YAxis tick={{ fontSize: 10, fill: "var(--foreground)" }} width={40} />
          <Tooltip
            contentStyle={{
              fontSize: 14,
              backgroundColor: "var(--background-elevated)",
              border: "1px solid var(--fill-quaternary)",
              borderRadius: 10,
              boxShadow: "var(--shadow-card)",
            }}
            formatter={(value: number) => [`$${Number(value).toFixed(2)}`, "Spent"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={() => "Amount spent"} />
          <Bar dataKey="total" fill="#0071e3" name="Amount spent" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BalanceLineProps {
  data: { date: string; balance: number; label: string }[];
}

export function BalanceLineChart({ data }: BalanceLineProps) {
  return (
    <div className="w-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px]">
        <h3 className="text-[15px] sm:text-base font-semibold text-[var(--foreground)] mb-3">
        Balance over time
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--fill-quaternary)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: "var(--foreground)" }}
          />
          <YAxis tick={{ fontSize: 10, fill: "var(--foreground)" }} width={40} />
          <Tooltip
            contentStyle={{
              fontSize: 14,
              backgroundColor: "var(--background-elevated)",
              border: "1px solid var(--fill-quaternary)",
              borderRadius: 10,
              boxShadow: "var(--shadow-card)",
            }}
            formatter={(value: number) => [`$${Number(value).toFixed(2)}`, "Balance"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={() => "Your balance"} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#0071e3"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Your balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPieProps {
  data: { name: string; value: number }[];
}

export function CategoryPieChart({ data }: CategoryPieProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="w-full">
        <h3 className="text-[15px] sm:text-base font-semibold text-[var(--foreground)] mb-3">
          Spending by category
        </h3>
        <p className="text-[13px] text-[var(--muted)]">No spending data yet. Add expenses or bills to see a breakdown.</p>
      </div>
    );
  }
  return (
    <div className="w-full min-h-[260px] sm:min-h-[300px] md:min-h-[320px]">
      <h3 className="text-[15px] sm:text-base font-semibold text-[var(--foreground)] mb-3">
        Spending by category
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              fontSize: 14,
              backgroundColor: "var(--background-elevated)",
              border: "1px solid var(--fill-quaternary)",
              borderRadius: 10,
              boxShadow: "var(--shadow-card)",
            }}
            formatter={(value: number, name: string) => [
              `$${Number(value).toFixed(2)}`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
