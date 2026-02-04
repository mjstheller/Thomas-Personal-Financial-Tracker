"use client";

import { useEffect, useState, useCallback } from "react";
import type { FinancialRecord } from "@/types/record";
import { fetchRecords, addRecord, updateRecord, deleteRecord } from "@/lib/records";
import { exportToCSV, exportToPDF } from "@/lib/export";
import { Dashboard } from "@/components/Dashboard";
import { RecordForm } from "@/components/RecordForm";
import { RecordList } from "@/components/RecordList";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type View = "dashboard" | "add" | "list" | "export";

export default function Home() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [editing, setEditing] = useState<FinancialRecord | null>(null);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | null>(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecords();
      setRecords(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load your data. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleSave = async (data: {
    type: FinancialRecord["type"];
    amount: number;
    category: string;
    label: string;
    date: string;
  }) => {
    if (editing) {
      await updateRecord(editing.id, data);
    } else {
      await addRecord(data.type, data.amount, data.category, data.label, data.date);
    }
    await loadRecords();
    setEditing(null);
    setView("dashboard");
  };

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
    await loadRecords();
    setEditing(null);
  };

  const handleExportConfirm = () => {
    if (exportFormat === "csv") exportToCSV(records);
    if (exportFormat === "pdf") exportToPDF(records);
    setShowExportConfirm(false);
    setExportFormat(null);
  };

  const navTabs: { view: View; label: string; shortLabel: string }[] = [
    { view: "dashboard", label: "Dashboard", shortLabel: "Dashboard" },
    { view: "list", label: "View all records", shortLabel: "Records" },
    { view: "export", label: "Export", shortLabel: "Export" },
  ];

  const navTabClass = (v: View) =>
    `min-h-[44px] md:min-h-[48px] flex-1 md:flex-none px-4 md:px-5 py-2.5 text-[15px] md:text-base font-medium rounded-lg transition-all duration-200 ${
      view === v
        ? "bg-[var(--background-elevated)] text-[var(--primary)] shadow-[var(--shadow-sm)]"
        : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] active:opacity-80"
    }`;

  const addRecordButtonClass =
    "min-h-[44px] md:min-h-[48px] px-4 md:px-5 py-2.5 text-[15px] md:text-base font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:opacity-90 transition-all duration-200 shrink-0";

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0">
      <header className="bg-[var(--background-elevated)]/80 backdrop-blur-xl sticky top-0 z-40 pt-[var(--safe-top)] border-b border-[var(--fill-quaternary)]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 md:py-7">
          <h1 className="text-[22px] sm:text-2xl md:text-[28px] font-semibold text-[var(--foreground)] tracking-tight">
            Thomas Finance
          </h1>
          <p className="text-[15px] md:text-base text-[var(--muted)] mt-0.5">
            Track your money simply. Your data is saved safely online.
          </p>
        </div>
        {/* Desktop/tablet nav: tabs left, Add record right */}
        <nav
          className="max-w-3xl mx-auto px-4 sm:px-6 pb-4 hidden md:flex md:items-center md:justify-between md:gap-4"
          aria-label="Main menu"
        >
          <div className="segmented-pill inline-flex flex-wrap gap-1 p-1 bg-[var(--fill-tertiary)] rounded-xl">
            {navTabs.map(({ view: v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setView(v);
                  setEditing(null);
                }}
                className={navTabClass(v)}
                data-active={view === v ? "true" : undefined}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setView("add");
            }}
            className={addRecordButtonClass}
          >
            Add record
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-5 md:py-8 w-full min-w-0">
        {loading ? (
          <div className="text-[15px] text-[var(--muted)] py-16 text-center">
            Loading your records…
          </div>
        ) : error ? (
          <div
            className="card-surface rounded-2xl p-6 border border-[var(--danger-muted)] bg-[var(--danger-muted)]"
            role="alert"
          >
            <h2 className="text-lg font-semibold text-[var(--danger)] mb-2">
              Something went wrong
            </h2>
            <p className="text-[15px] text-[var(--foreground-secondary)]">{error}</p>
            <p className="text-sm text-[var(--muted)] mt-2">
              Make sure you have set up the database. See the README for setup steps.
            </p>
            <button
              type="button"
              onClick={loadRecords}
              className="mt-5 min-h-[44px] px-5 py-2.5 text-[15px] font-medium rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        ) : view === "dashboard" ? (
          <Dashboard records={records} />
        ) : view === "add" ? (
          <RecordForm
            record={editing}
            onSave={handleSave}
            onCancel={() => {
              setEditing(null);
              setView("dashboard");
            }}
          />
        ) : view === "list" ? (
          <section className="min-w-0">
            <h2 className="text-[20px] sm:text-xl font-semibold text-[var(--foreground)] mb-1">
              All records
            </h2>
            <p className="text-[15px] text-[var(--muted)] mb-5">
              Tap Edit to change a record, or Delete to remove it. You will be asked to confirm before anything is deleted.
            </p>
            <RecordList
              records={records}
              onEdit={(r) => {
                setEditing(r);
                setView("add");
              }}
              onDelete={handleDelete}
            />
            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setView("add");
                }}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-[15px] font-medium rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:opacity-90 transition-opacity"
              >
                Add record
              </button>
            </div>
          </section>
        ) : (
          <section className="min-w-0">
            <h2 className="text-[20px] sm:text-xl font-semibold text-[var(--foreground)] mb-1">
              Export your records
            </h2>
            <p className="text-[15px] text-[var(--muted)] mb-5">
              Choose a format. A file will download with all your records.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setExportFormat("csv");
                  setShowExportConfirm(true);
                }}
                className="card-surface min-h-[48px] px-5 py-3 text-[15px] font-medium rounded-xl text-[var(--foreground)] hover:opacity-90 active:opacity-95 transition-opacity text-left"
              >
                Download as CSV (spreadsheet)
              </button>
              <button
                type="button"
                onClick={() => {
                  setExportFormat("pdf");
                  setShowExportConfirm(true);
                }}
                className="card-surface min-h-[48px] px-5 py-3 text-[15px] font-medium rounded-xl text-[var(--foreground)] hover:opacity-90 active:opacity-95 transition-opacity text-left"
              >
                Download as PDF
              </button>
            </div>
            <p className="text-sm text-[var(--muted)] mt-4">
              CSV opens in Excel or Google Sheets. PDF is good for printing.
            </p>
          </section>
        )}
      </main>

      {/* Mobile bottom navigation - tabs left, Add right */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--background-elevated)]/90 backdrop-blur-xl border-t border-[var(--fill-quaternary)]/50 z-40 pb-[var(--safe-bottom)] pt-2"
        aria-label="Main menu"
      >
        <div className="max-w-3xl mx-auto flex items-center gap-2 px-2">
          <div className="segmented-pill flex-1 flex min-w-0 p-1">
            {navTabs.map(({ view: v, shortLabel }) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setView(v);
                  setEditing(null);
                }}
                className={navTabClass(v)}
                data-active={view === v ? "true" : undefined}
              >
                {shortLabel}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setView("add");
            }}
            className={addRecordButtonClass}
          >
            Add
          </button>
        </div>
      </nav>

      <ConfirmDialog
        open={showExportConfirm}
        title="Export records"
        message={`Download all ${records.length} record(s) as ${exportFormat === "csv" ? "a CSV file" : "a PDF file"}?`}
        confirmLabel="Yes, download"
        cancelLabel="Cancel"
        danger={false}
        onConfirm={handleExportConfirm}
        onCancel={() => {
          setShowExportConfirm(false);
          setExportFormat(null);
        }}
      />
    </div>
  );
}
