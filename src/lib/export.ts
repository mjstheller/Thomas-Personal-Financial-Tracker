import type { FinancialRecord } from "@/types/record";
import { RECORD_TYPE_LABELS } from "@/types/record";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(records: FinancialRecord[]): void {
  const headers = ["Type", "Amount", "Category", "Label", "Date"];
  const rows = records.map((r) => [
    RECORD_TYPE_LABELS[r.type],
    String(r.amount),
    r.category,
    r.label,
    r.date,
  ]);
  const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `finance-records-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(records: FinancialRecord[]): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  doc.setFontSize(18);
  doc.text("Personal Finance Records", 40, 40);
  doc.setFontSize(11);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 40, 58);

  const tableData = records.map((r) => [
    RECORD_TYPE_LABELS[r.type],
    String(r.amount),
    r.category,
    r.label,
    r.date,
  ]);

  autoTable(doc, {
    startY: 72,
    head: [["Type", "Amount", "Category", "Label", "Date"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [26, 95, 74] },
    margin: { left: 40, right: 40 },
  });

  doc.save(`finance-records-${new Date().toISOString().slice(0, 10)}.pdf`);
}
