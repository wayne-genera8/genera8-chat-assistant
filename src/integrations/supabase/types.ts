export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          cal_event_id: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          conversation_id: string | null
          conversation_transcript_url: string | null
          country: string | null
          created_at: string | null
          dealer_name: string | null
          duration_minutes: number | null
          followup_sent: boolean | null
          id: string
          pain_summary: string | null
          product_id: string | null
          reminder_sent: boolean | null
          scheduled_at: string
          status: string | null
        }
        Insert: {
          cal_event_id?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          conversation_id?: string | null
          conversation_transcript_url?: string | null
          country?: string | null
          created_at?: string | null
          dealer_name?: string | null
          duration_minutes?: number | null
          followup_sent?: boolean | null
          id?: string
          pain_summary?: string | null
          product_id?: string | null
          reminder_sent?: boolean | null
          scheduled_at: string
          status?: string | null
        }
        Update: {
          cal_event_id?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          conversation_id?: string | null
          conversation_transcript_url?: string | null
          country?: string | null
          created_at?: string | null
          dealer_name?: string | null
          duration_minutes?: number | null
          followup_sent?: boolean | null
          id?: string
          pain_summary?: string | null
          product_id?: string | null
          reminder_sent?: boolean | null
          scheduled_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          business_size: string | null
          contact_name: string | null
          country: string | null
          current_tools: string | null
          dealer_name: string | null
          demo_booked_at: string | null
          demo_cal_event_id: string | null
          ended_at: string | null
          id: string
          lang: string | null
          language: string | null
          last_message_at: string | null
          message_count: number | null
          primary_pain: string | null
          product_id: string | null
          session_id: string
          started_at: string | null
          status: string | null
          variant: string | null
        }
        Insert: {
          business_size?: string | null
          contact_name?: string | null
          country?: string | null
          current_tools?: string | null
          dealer_name?: string | null
          demo_booked_at?: string | null
          demo_cal_event_id?: string | null
          ended_at?: string | null
          id?: string
          lang?: string | null
          language?: string | null
          last_message_at?: string | null
          message_count?: number | null
          primary_pain?: string | null
          product_id?: string | null
          session_id: string
          started_at?: string | null
          status?: string | null
          variant?: string | null
        }
        Update: {
          business_size?: string | null
          contact_name?: string | null
          country?: string | null
          current_tools?: string | null
          dealer_name?: string | null
          demo_booked_at?: string | null
          demo_cal_event_id?: string | null
          ended_at?: string | null
          id?: string
          lang?: string | null
          language?: string | null
          last_message_at?: string | null
          message_count?: number | null
          primary_pain?: string | null
          product_id?: string | null
          session_id?: string
          started_at?: string | null
          status?: string | null
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_log: {
        Row: {
          booking_id: string | null
          channel: string
          created_at: string | null
          error_message: string | null
          id: string
          payload: Json | null
          recipient: string
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          channel: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload?: Json | null
          recipient: string
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          channel?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload?: Json | null
          recipient?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          brochure_url: string | null
          cal_event_type: string | null
          created_at: string | null
          id: string
          name: string
          notification_channels: Json | null
          owner_email: string | null
          owner_name: string
          owner_phone: string | null
          owner_whatsapp: string | null
          slug: string
          system_prompt: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          brochure_url?: string | null
          cal_event_type?: string | null
          created_at?: string | null
          id?: string
          name: string
          notification_channels?: Json | null
          owner_email?: string | null
          owner_name?: string
          owner_phone?: string | null
          owner_whatsapp?: string | null
          slug: string
          system_prompt: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          brochure_url?: string | null
          cal_event_type?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notification_channels?: Json | null
          owner_email?: string | null
          owner_name?: string
          owner_phone?: string | null
          owner_whatsapp?: string | null
          slug?: string
          system_prompt?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
