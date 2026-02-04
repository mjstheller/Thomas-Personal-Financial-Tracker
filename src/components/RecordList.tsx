"use client";

import { useState } from "react";
import type { FinancialRecord } from "@/types/record";
import { RECORD_TYPE_LABELS } from "@/types/record";
import { ConfirmDialog } from "./ConfirmDialog";

interface RecordListProps {
  records: FinancialRecord[];
  onEdit: (r: FinancialRecord) => void;
  onDelete: (id: string) => Promise<void>;
}

export function RecordList({ records, onEdit, onDelete }: RecordListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await onDelete(deletingId);
    setDeletingId(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatAmount = (r: FinancialRecord) => {
    const n = r.amount;
    const prefix = r.type === "income" ? "+" : "−";
    return `${prefix} $${n.toFixed(2)}`;
  };

  if (records.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center">
        <p className="text-[15px] font-medium text-[var(--muted)]">No records yet.</p>
        <p className="text-[13px] md:text-[15px] text-[var(--muted)] mt-2">Use “Add record” above to add your first expense, bill, or income.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3" role="list">
        {records.map((r) => (
          <li
            key={r.id}
            className="card-surface flex flex-row flex-nowrap items-center gap-3 sm:gap-4 rounded-2xl py-3 px-4 sm:py-3 sm:px-5 min-h-[56px]"
          >
            {/* Left: label + details, single line, truncates */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-[15px] text-[var(--foreground)] truncate">
                <span className="font-semibold">{r.label || "No label"}</span>
                <span className="text-[var(--muted)] font-normal">
                  {" · "}
                  {RECORD_TYPE_LABELS[r.type]}
                  {r.category ? ` · ${r.category}` : ""}
                  {" · "}
                  {formatDate(r.date)}
                </span>
              </p>
            </div>
            {/* Middle: amount */}
            <div className="flex items-center shrink-0 w-24 sm:w-28 justify-end">
              <span
                className={`inline-block text-base sm:text-lg font-semibold tabular-nums whitespace-nowrap px-2.5 py-1 rounded-lg ${
                  r.type === "income"
                    ? "text-[var(--success)] bg-[var(--success)]/10"
                    : "text-[var(--foreground)] bg-[var(--fill-tertiary)]"
                }`}
              >
                {formatAmount(r)}
              </span>
            </div>
            {/* Right: Edit & Delete */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(r)}
                className="min-h-[40px] min-w-[40px] px-3 py-1.5 text-[14px] font-medium rounded-lg bg-[var(--fill-tertiary)] text-[var(--foreground)] hover:opacity-90 active:opacity-80 transition-opacity"
                aria-label={`Edit ${r.label}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(r.id)}
                className="min-h-[40px] min-w-[40px] px-3 py-1.5 text-[14px] font-medium rounded-lg bg-[var(--danger)] text-white hover:opacity-90 active:opacity-90 transition-opacity"
                aria-label={`Delete ${r.label}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete this record?"
        message="This cannot be undone. The record will be removed from your list."
        confirmLabel="Yes, delete it"
        cancelLabel="Cancel"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}
