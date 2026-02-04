"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import type { FinancialRecord } from "@/types/record";
import { RECORD_TYPE_LABELS, RECORD_TYPES } from "@/types/record";

/** Strip input to raw digits and at most one decimal point (decimals allowed, up to 6 places). */
function toRawAmount(input: string): string {
  const noSymbols = input.replace(/[$,]/g, "");
  const parts = noSymbols.split(".");
  if (parts.length === 1) return parts[0].replace(/\D/g, "");
  const intPart = parts[0].replace(/\D/g, "");
  const decPart = parts[1].replace(/\D/g, "").slice(0, 6);
  return `${intPart}.${decPart}`;
}

/** Format raw amount for display: $ and comma every 1000s. Keep trailing period so user can type decimals. */
function formatAmountForDisplay(raw: string): string {
  if (raw === "" || raw === ".") return raw;
  const parts = raw.split(".");
  const intPart = parts[0] || "0";
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decPart = parts[1] ?? "";
  if (decPart.length > 0) return `$${withCommas}.${decPart}`;
  if (raw.endsWith(".")) return `$${withCommas}.`;
  return `$${withCommas}`;
}

interface RecordFormProps {
  record?: FinancialRecord | null;
  onSave: (data: {
    type: FinancialRecord["type"];
    amount: number;
    category: string;
    label: string;
    date: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function RecordForm({ record, onSave, onCancel }: RecordFormProps) {
  const [type, setType] = useState<FinancialRecord["type"]>(
    record?.type ?? "expense"
  );
  const [amount, setAmount] = useState(record ? String(record.amount) : "");
  const [category, setCategory] = useState(record?.category ?? "");
  const [label, setLabel] = useState(record?.label ?? "");
  const [date, setDate] = useState(record?.date ?? new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const num = parseFloat(amount);
    if (Number.isNaN(num) || num < 0) {
      setError("Please enter a valid amount (a number that is 0 or more).");
      return;
    }
    if (!label.trim()) {
      setError("Please give this record a short label (for example: Groceries).");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        type,
        amount: num,
        category: category.trim(),
        label: label.trim(),
        date,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const title = record ? "Edit this record" : "Add a new record";
  const step = record ? "Change any details below and tap Save." : "Step 1: Choose the type. Step 2: Enter amount and details. Step 3: Tap Save.";

  return (
    <div className="max-w-2xl mx-auto w-full min-w-0 px-0">
      <h2 className="text-[20px] sm:text-xl font-semibold text-[var(--foreground)] mb-1">{title}</h2>
      <p className="text-[15px] text-[var(--muted)] mb-5">{step}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          id="record-type"
          label="Type of record"
          tooltip="Choose what this money is: salary/income, expense, bill, savings, or installment."
        >
          <select
            id="record-type"
            value={type}
            onChange={(e) => setType(e.target.value as FinancialRecord["type"])}
            className="input-soft w-full min-h-[48px] px-4 text-[15px] md:text-base text-[var(--foreground)]"
            aria-describedby="record-type-hint"
          >
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>
                {RECORD_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="amount"
          label="Amount"
          tooltip="Enter the amount in dollars. Use decimals for cents (e.g. 99.99 or 10.50). Dollar sign and commas are added automatically."
        >
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={formatAmountForDisplay(amount)}
            onChange={(e) => setAmount(toRawAmount(e.target.value))}
            className="input-soft w-full min-h-[48px] px-4 text-[15px] md:text-base text-[var(--foreground)]"
            placeholder="$0.00"
            aria-describedby="amount-hint"
          />
        </FormField>

        <FormField
          id="label"
          label="Label (short description)"
          tooltip="A short name for this record, e.g. Groceries, Electric bill, or February salary."
        >
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="input-soft w-full min-h-[48px] px-4 text-[15px] md:text-base text-[var(--foreground)]"
            placeholder="e.g. Groceries"
            aria-describedby="label-hint"
          />
        </FormField>

        <FormField
          id="category"
          label="Category"
          tooltip="Group similar items (e.g. Food, Utilities, Health). Used for reports and charts."
        >
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-soft w-full min-h-[48px] px-4 text-[15px] md:text-base text-[var(--foreground)]"
            placeholder="e.g. Food"
            aria-describedby="category-hint"
          />
        </FormField>

        <FormField
          id="date"
          label="Date"
          tooltip="The date this money was received or spent. Use the calendar or type YYYY-MM-DD."
        >
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-soft w-full min-h-[48px] px-4 text-[15px] md:text-base text-[var(--foreground)]"
            aria-describedby="date-hint"
          />
        </FormField>

        {error && (
          <div className="p-4 rounded-xl bg-[var(--danger-muted)] border border-[var(--danger)]/20" role="alert">
            <p className="text-[15px] font-medium text-[var(--danger)]">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[44px] px-5 py-2.5 text-[15px] font-medium rounded-lg bg-[var(--fill-tertiary)] text-[var(--foreground)] hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 min-h-[44px] px-5 py-2.5 text-[15px] font-medium rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 active:opacity-90 transition-opacity"
          >
            {saving ? "Saving…" : record ? "Save changes" : "Save record"}
          </button>
        </div>
      </form>
    </div>
  );
}
