export type RecordType =
  | "expense"
  | "bill"
  | "savings"
  | "installment"
  | "income";

export interface FinancialRecord {
  id: string;
  type: RecordType;
  amount: number; // always positive; we treat income as positive, others as negative for balance
  category: string;
  label: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
}

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  expense: "Expense",
  bill: "Bill",
  savings: "Savings",
  installment: "Installment",
  income: "Salary or income",
};

export const RECORD_TYPES: RecordType[] = [
  "income",
  "expense",
  "bill",
  "savings",
  "installment",
];
