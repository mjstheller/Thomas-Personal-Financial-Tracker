import type { FinancialRecord } from "@/types/record";

export type Period = "weekly" | "monthly" | "yearly";

function getWeekBounds(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getMonthBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function getYearBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
}

export function filterByPeriod(
  records: FinancialRecord[],
  period: Period,
  anchorDate: Date
): FinancialRecord[] {
  let start: Date;
  let end: Date;
  if (period === "weekly") {
    const b = getWeekBounds(anchorDate);
    start = b.start;
    end = b.end;
  } else if (period === "monthly") {
    const b = getMonthBounds(anchorDate);
    start = b.start;
    end = b.end;
  } else {
    const b = getYearBounds(anchorDate);
    start = b.start;
    end = b.end;
  }
  return records.filter((r) => {
    const d = new Date(r.date);
    return d >= start && d <= end;
  });
}

export function totalIncome(records: FinancialRecord[]): number {
  return records
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);
}

/** Money spent (expenses, bills, installments) – excludes savings. */
export function totalExpenses(records: FinancialRecord[]): number {
  return records
    .filter((r) =>
      ["expense", "bill", "installment"].includes(r.type)
    )
    .reduce((sum, r) => sum + r.amount, 0);
}

/** All outflows (expenses, bills, savings, installments) – used for balance. */
export function totalOutgoings(records: FinancialRecord[]): number {
  return records
    .filter((r) =>
      ["expense", "bill", "savings", "installment"].includes(r.type)
    )
    .reduce((sum, r) => sum + r.amount, 0);
}

export function totalSavings(records: FinancialRecord[]): number {
  return records
    .filter((r) => r.type === "savings")
    .reduce((sum, r) => sum + r.amount, 0);
}

export function balance(records: FinancialRecord[]): number {
  const income = totalIncome(records);
  const out = totalOutgoings(records);
  return income - out;
}

/** Monthly totals for bar chart: array of { month (label), total } */
export function monthlyExpensesForChart(
  records: FinancialRecord[],
  year: number
): { month: string; total: number; fullDate: string }[] {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const outTypes = ["expense", "bill", "installment"];
  const byMonth = new Map<number, number>();
  for (let i = 0; i < 12; i++) byMonth.set(i, 0);
  records.forEach((r) => {
    const d = new Date(r.date);
    if (d.getFullYear() !== year || !outTypes.includes(r.type)) return;
    byMonth.set(d.getMonth(), (byMonth.get(d.getMonth()) ?? 0) + r.amount);
  });
  return months.map((month, i) => ({
    month,
    total: byMonth.get(i) ?? 0,
    fullDate: `${year}-${String(i + 1).padStart(2, "0")}-01`,
  }));
}

/** Balance over time for line chart: cumulative by date */
export function balanceOverTimeForChart(
  records: FinancialRecord[]
): { date: string; balance: number; label: string }[] {
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let running = 0;
  const points: { date: string; balance: number; label: string }[] = [];
  sorted.forEach((r) => {
    if (r.type === "income") running += r.amount;
    else running -= r.amount;
    points.push({
      date: r.date,
      balance: running,
      label: new Date(r.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  });
  return points;
}

/** Category breakdown for pie chart (expenses + bills + installments) */
export function categoryBreakdownForChart(
  records: FinancialRecord[]
): { name: string; value: number }[] {
  const outTypes = ["expense", "bill", "installment"];
  const byCategory = new Map<string, number>();
  records.forEach((r) => {
    if (!outTypes.includes(r.type)) return;
    const cat = r.category.trim() || "Other";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + r.amount);
  });
  return Array.from(byCategory.entries()).map(([name, value]) => ({
    name,
    value,
  }));
}
