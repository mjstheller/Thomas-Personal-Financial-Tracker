import { supabase } from "./supabase";
import type { FinancialRecord } from "@/types/record";
import type { Database, RecordType } from "@/types/database";

type RecordRow = Database["public"]["Tables"]["records"]["Row"];

function rowToRecord(row: RecordRow): FinancialRecord {
  return {
    id: row.id,
    type: row.type as FinancialRecord["type"],
    amount: Number(row.amount),
    category: row.category,
    label: row.label,
    date: row.date,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function fetchRecords(): Promise<FinancialRecord[]> {
  const { data, error } = await supabase
    .from("records")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as RecordRow[];
  return rows.map(rowToRecord);
}

export async function addRecord(
  type: RecordType,
  amount: number,
  category: string,
  label: string,
  date: string
): Promise<FinancialRecord> {
  const { data, error } = await supabase
    .from("records")
    .insert({
      type,
      amount,
      category,
      label,
      date,
    } as Record<string, unknown>)
    .select()
    .single();
  if (error) throw error;
  return rowToRecord(data as RecordRow);
}

export async function updateRecord(
  id: string,
  updates: {
    type?: RecordType;
    amount?: number;
    category?: string;
    label?: string;
    date?: string;
  }
): Promise<FinancialRecord> {
  const { data, error } = await supabase
    .from("records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToRecord(data as RecordRow);
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from("records").delete().eq("id", id);
  if (error) throw error;
}
