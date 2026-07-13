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
      block_replies: {
        Row: {
          block_id: string
          content: string
          created_at: string
          from_user: boolean
          id: string
          specialist_id: string | null
        }
        Insert: {
          block_id: string
          content: string
          created_at?: string
          from_user?: boolean
          id?: string
          specialist_id?: string | null
        }
        Update: {
          block_id?: string
          content?: string
          created_at?: string
          from_user?: boolean
          id?: string
          specialist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "block_replies_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "content_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      child_daily_activity: {
        Row: {
          activity_date: string
          child_profile_id: string
          created_at: string
          id: string
          sparks_earned: number
          time_spent_seconds: number
          topics_explored: number
        }
        Insert: {
          activity_date?: string
          child_profile_id: string
          created_at?: string
          id?: string
          sparks_earned?: number
          time_spent_seconds?: number
          topics_explored?: number
        }
        Update: {
          activity_date?: string
          child_profile_id?: string
          created_at?: string
          id?: string
          sparks_earned?: number
          time_spent_seconds?: number
          topics_explored?: number
        }
        Relationships: [
          {
            foreignKeyName: "child_daily_activity_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          id: string
          interests: string[] | null
          language: string | null
          last_active_date: string | null
          name: string
          parent_user_id: string
          pin: string | null
          sparks_balance: number
          streak_days: number
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          language?: string | null
          last_active_date?: string | null
          name: string
          parent_user_id: string
          pin?: string | null
          sparks_balance?: number
          streak_days?: number
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          language?: string | null
          last_active_date?: string | null
          name?: string
          parent_user_id?: string
          pin?: string | null
          sparks_balance?: number
          streak_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      child_tasks: {
        Row: {
          assigned_at: string
          child_profile_id: string
          completed_at: string | null
          id: string
          status: string
          task_id: string
        }
        Insert: {
          assigned_at?: string
          child_profile_id: string
          completed_at?: string | null
          id?: string
          status?: string
          task_id: string
        }
        Update: {
          assigned_at?: string
          child_profile_id?: string
          completed_at?: string | null
          id?: string
          status?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_tasks_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          bookmarked: boolean
          content: Json
          created_at: string
          curio_id: string
          id: string
          liked: boolean
          specialist_id: string | null
          type: string
        }
        Insert: {
          bookmarked?: boolean
          content?: Json
          created_at?: string
          curio_id: string
          id?: string
          liked?: boolean
          specialist_id?: string | null
          type: string
        }
        Update: {
          bookmarked?: boolean
          content?: Json
          created_at?: string
          curio_id?: string
          id?: string
          liked?: boolean
          specialist_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_curio_id_fkey"
            columns: ["curio_id"]
            isOneToOne: false
            referencedRelation: "curios"
            referencedColumns: ["id"]
          },
        ]
      }
      curio_images: {
        Row: {
          created_at: string
          generation_method: string | null
          id: string
          image_url: string
          topic: string
        }
        Insert: {
          created_at?: string
          generation_method?: string | null
          id?: string
          image_url: string
          topic: string
        }
        Update: {
          created_at?: string
          generation_method?: string | null
          id?: string
          image_url?: string
          topic?: string
        }
        Relationships: []
      }
      curios: {
        Row: {
          child_id: string
          created_at: string
          id: string
          last_updated_at: string
          query: string | null
          title: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          last_updated_at?: string
          query?: string | null
          title: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          last_updated_at?: string
          query?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "curios_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_history: {
        Row: {
          child_id: string
          content_id: string | null
          id: string
          interaction_date: string
          interaction_type: string | null
          metadata: Json | null
          topic: string | null
        }
        Insert: {
          child_id: string
          content_id?: string | null
          id?: string
          interaction_date?: string
          interaction_type?: string | null
          metadata?: Json | null
          topic?: string | null
        }
        Update: {
          child_id?: string
          content_id?: string | null
          id?: string
          interaction_date?: string
          interaction_type?: string | null
          metadata?: Json | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_history_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_sections: {
        Row: {
          content: string
          created_at: string
          facts: Json
          id: string
          image_generated: boolean
          image_url: string | null
          section_number: number
          story_mode_content: string | null
          title: string
          topic_id: string
          updated_at: string
          word_count: number
        }
        Insert: {
          content?: string
          created_at?: string
          facts?: Json
          id?: string
          image_generated?: boolean
          image_url?: string | null
          section_number: number
          story_mode_content?: string | null
          title: string
          topic_id: string
          updated_at?: string
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          facts?: Json
          id?: string
          image_generated?: boolean
          image_url?: string | null
          section_number?: number
          story_mode_content?: string | null
          title?: string
          topic_id?: string
          updated_at?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_sections_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_topics: {
        Row: {
          child_age: number
          child_id: string
          created_at: string
          current_section: number
          description: string | null
          id: string
          status: string
          table_of_contents: Json
          title: string
          total_sections: number
          updated_at: string
        }
        Insert: {
          child_age?: number
          child_id: string
          created_at?: string
          current_section?: number
          description?: string | null
          id?: string
          status?: string
          table_of_contents?: Json
          title: string
          total_sections?: number
          updated_at?: string
        }
        Update: {
          child_age?: number
          child_id?: string
          created_at?: string
          current_section?: number
          description?: string | null
          id?: string
          status?: string
          table_of_contents?: Json
          title?: string
          total_sections?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_topics_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sparks_transactions: {
        Row: {
          amount: number
          child_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sparks_transactions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          parent_user_id: string
          sparks_reward: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          parent_user_id: string
          sparks_reward?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          parent_user_id?: string
          sparks_reward?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_child: { Args: { _child_id: string }; Returns: boolean }
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
