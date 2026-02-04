"use client";

import { useId } from "react";

interface FormFieldProps {
  label: string;
  tooltip: string;
  id?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, tooltip, id: idProp, error, children }: FormFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[15px] font-medium text-[var(--foreground)]"
        title={tooltip}
      >
        {label}
      </label>
      <span
        className="text-[13px] text-[var(--muted)] mt-0.5"
        role="tooltip"
        id={`${id}-hint`}
      >
        {tooltip}
      </span>
      <div className="mt-1" aria-describedby={error ? `${id}-error` : `${id}-hint`}>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[15px] font-medium text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
