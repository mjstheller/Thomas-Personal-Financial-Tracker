"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Tab") {
        e.preventDefault();
        (e.target as HTMLElement) === cancelRef.current
          ? confirmRef.current?.focus()
          : cancelRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    cancelRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-3xl bg-[var(--background-elevated)] p-6 sm:p-8 shadow-[var(--shadow-modal)] max-h-[90vh] overflow-y-auto">
        <h2 id="confirm-title" className="text-[20px] sm:text-xl font-semibold text-[var(--foreground)] mb-2">
          {title}
        </h2>
        <p id="confirm-desc" className="text-[15px] text-[var(--foreground-secondary)] mb-6">
          {message}
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[44px] px-4 py-2.5 text-[15px] font-medium rounded-lg bg-[var(--fill-tertiary)] text-[var(--foreground)] hover:opacity-90 active:opacity-80 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`flex-1 min-h-[44px] px-4 py-2.5 text-[15px] font-medium rounded-lg text-white transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] active:opacity-90 ${
              danger
                ? "bg-[var(--danger)] hover:bg-[var(--danger-hover)]"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
