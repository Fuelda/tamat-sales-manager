export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          contact: string;
          communication_channel: string;
          business_type: string;
          reach_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          communication_channel: string;
          business_type: string;
          reach_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          communication_channel?: string;
          business_type?: string;
          reach_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_history: {
        Row: {
          id: string;
          company_id: string;
          content: string;
          status: string;
          contact_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          content: string;
          status: string;
          contact_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          content?: string;
          status?: string;
          contact_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_history_company_id_fkey";
            columns: ["company_id"];
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          id: string;
          company_id: string;
          price: number;
          billing_date: string;
          payment_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          price: number;
          billing_date: string;
          payment_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          price?: number;
          billing_date?: string;
          payment_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey";
            columns: ["company_id"];
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      communication_channels: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_recently_uncontacted_companies: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          name: string;
          business_type: string;
          last_contact_date: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
