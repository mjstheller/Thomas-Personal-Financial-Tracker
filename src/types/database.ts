export type RecordType = "expense" | "bill" | "savings" | "installment" | "income";

export interface Database {
  public: {
    Tables: {
      records: {
        Row: {
          id: string;
          type: RecordType;
          amount: number;
          category: string;
          label: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: RecordType;
          amount: number;
          category: string;
          label: string;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: RecordType;
          amount?: number;
          category?: string;
          label?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
