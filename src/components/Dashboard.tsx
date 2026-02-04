"use client";

import { useMemo, useState } from "react";
import type { FinancialRecord } from "@/types/record";
import {
  filterByPeriod,
  balance,
  totalOutgoings,
  totalSavings,
  monthlyExpensesForChart,
  balanceOverTimeForChart,
  categoryBreakdownForChart,
  type Period,
} from "@/lib/aggregate";
import { MonthlyExpensesBarChart, BalanceLineChart, CategoryPieChart } from "./Charts";

interface DashboardProps {
  records: FinancialRecord[];
}

const PERIOD_LABELS: Record<Period, string> = {
  weekly: "This week",
  monthly: "This month",
  yearly: "This year",
};

export function Dashboard({ records }: DashboardProps) {
  const [period, setPeriod] = useState<Period>("monthly");
  const anchor = useMemo(() => new Date(), []);

  const filtered = useMemo(
    () => filterByPeriod(records, period, anchor),
    [records, period, anchor]
  );

  const totalBalance = useMemo(() => balance(filtered), [filtered]);
  const totalExpenses = useMemo(() => totalOutgoings(filtered), [filtered]);
  const totalSavingsAmount = useMemo(() => totalSavings(filtered), [filtered]);

  const barData = useMemo(
    () => monthlyExpensesForChart(records, anchor.getFullYear()),
    [records, anchor]
  );
  const lineData = useMemo(() => balanceOverTimeForChart(records), [records]);
  const pieData = useMemo(() => categoryBreakdownForChart(records), [records]);

  return (
    <div className="space-y-6 md:space-y-8 min-w-0">
      <section>
        <h2 className="text-[20px] sm:text-xl font-semibold text-[var(--foreground)] mb-1">
          Totals
        </h2>
        <p className="text-[15px] text-[var(--muted)] mb-4">
          Choose a period to see totals for that time.
        </p>
        <div
          className="segmented-pill grid grid-cols-3 gap-1 p-1.5 mb-5"
          role="group"
          aria-label="Select time period"
        >
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`min-h-[44px] px-3 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                period === p
                  ? "bg-[var(--background-elevated)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] active:opacity-80"
              }`}
              data-active={period === p ? "true" : undefined}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-surface rounded-2xl p-5 md:p-6">
            <p className="text-[13px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1">
              Total balance
            </p>
            <p className={`text-2xl md:text-3xl font-semibold tabular-nums tracking-tight ${totalBalance >= 0 ? "text-[var(--primary)]" : "text-[var(--danger)]"}`}>
              ${totalBalance.toFixed(2)}
            </p>
            <p className="text-[13px] text-[var(--muted)] mt-1.5">
              Income minus spending for {PERIOD_LABELS[period].toLowerCase()}
            </p>
          </div>
          <div className="card-surface rounded-2xl p-5 md:p-6">
            <p className="text-[13px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1">
              Total expenses
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-[var(--foreground)] tabular-nums tracking-tight break-all">
              ${totalExpenses.toFixed(2)}
            </p>
            <p className="text-[13px] text-[var(--muted)] mt-1.5">
              Bills, expenses, and installments
            </p>
          </div>
          <div className="card-surface rounded-2xl p-5 md:p-6">
            <p className="text-[13px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1">
              Total savings
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-[var(--success)] tabular-nums tracking-tight break-all">
              ${totalSavingsAmount.toFixed(2)}
            </p>
            <p className="text-[13px] text-[var(--muted)] mt-1.5">
              Money set aside for {PERIOD_LABELS[period].toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface rounded-2xl p-4 md:p-6 overflow-hidden">
        <MonthlyExpensesBarChart data={barData} />
      </section>

      <section className="card-surface rounded-2xl p-4 md:p-6 overflow-hidden">
        <BalanceLineChart data={lineData.length ? lineData : [{ date: "", balance: 0, label: "No data yet" }]} />
      </section>

      <section className="card-surface rounded-2xl p-4 md:p-6 overflow-hidden">
        <CategoryPieChart data={pieData} />
      </section>
    </div>
  );
}
