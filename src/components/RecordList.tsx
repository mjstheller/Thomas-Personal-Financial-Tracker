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
            className="card-surface flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 rounded-2xl p-4"
          >
            <div className="flex-1 min-w-0 order-1">
              <p className="text-[15px] font-semibold text-[var(--foreground)] truncate">
                {r.label || "No label"}
              </p>
              <p className="text-[13px] text-[var(--muted)] mt-0.5">
                {RECORD_TYPE_LABELS[r.type]}
                {r.category ? ` · ${r.category}` : ""} · {formatDate(r.date)}
              </p>
            </div>
            <p className={`text-[15px] font-semibold tabular-nums order-2 sm:order-3 ${r.type === "income" ? "text-[var(--success)]" : "text-[var(--foreground)]"}`}>
              {formatAmount(r)}
            </p>
            <div className="flex gap-2 order-3 sm:order-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => onEdit(r)}
                className="flex-1 sm:flex-none min-h-[44px] min-w-[44px] px-4 py-2 text-[15px] font-medium rounded-lg bg-[var(--fill-tertiary)] text-[var(--foreground)] hover:opacity-90 active:opacity-80 transition-opacity"
                aria-label={`Edit ${r.label}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(r.id)}
                className="flex-1 sm:flex-none min-h-[44px] min-w-[44px] px-4 py-2 text-[15px] font-medium rounded-lg bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)] active:opacity-90 transition-opacity"
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
