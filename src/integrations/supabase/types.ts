export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_usage_logs: {
        Row: {
          api_name: string
          created_at: string
          estimated_cost: number | null
          id: string
          request_data: Json | null
          response_status: string | null
          user_id: string | null
        }
        Insert: {
          api_name: string
          created_at?: string
          estimated_cost?: number | null
          id?: string
          request_data?: Json | null
          response_status?: string | null
          user_id?: string | null
        }
        Update: {
          api_name?: string
          created_at?: string
          estimated_cost?: number | null
          id?: string
          request_data?: Json | null
          response_status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      block_replies: {
        Row: {
          block_id: string
          content: string
          created_at: string
          from_user: boolean
          id: string
          user_id: string | null
        }
        Insert: {
          block_id: string
          content: string
          created_at?: string
          from_user?: boolean
          id?: string
          user_id?: string | null
        }
        Update: {
          block_id?: string
          content?: string
          created_at?: string
          from_user?: boolean
          id?: string
          user_id?: string | null
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
          created_at: string | null
          id: string
          quizzes_completed: number | null
          tasks_completed: number | null
          topics_explored: number | null
        }
        Insert: {
          activity_date: string
          child_profile_id: string
          created_at?: string | null
          id?: string
          quizzes_completed?: number | null
          tasks_completed?: number | null
          topics_explored?: number | null
        }
        Update: {
          activity_date?: string
          child_profile_id?: string
          created_at?: string | null
          id?: string
          quizzes_completed?: number | null
          tasks_completed?: number | null
          topics_explored?: number | null
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
          content_difficulty_preference: number | null
          created_at: string
          grade: string | null
          id: string
          interests: string[] | null
          language: string | null
          last_active: string | null
          learning_preferences: Json | null
          name: string
          parent_user_id: string
          pin: string
          sparks_balance: number | null
          streak_days: number | null
          streak_last_updated: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          content_difficulty_preference?: number | null
          created_at?: string
          grade?: string | null
          id?: string
          interests?: string[] | null
          language?: string | null
          last_active?: string | null
          learning_preferences?: Json | null
          name: string
          parent_user_id: string
          pin: string
          sparks_balance?: number | null
          streak_days?: number | null
          streak_last_updated?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          content_difficulty_preference?: number | null
          created_at?: string
          grade?: string | null
          id?: string
          interests?: string[] | null
          language?: string | null
          last_active?: string | null
          learning_preferences?: Json | null
          name?: string
          parent_user_id?: string
          pin?: string
          sparks_balance?: number | null
          streak_days?: number | null
          streak_last_updated?: string | null
        }
        Relationships: []
      }
      child_tasks: {
        Row: {
          assigned_at: string
          child_profile_id: string
          completed_at: string | null
          id: string
          status: string | null
          task_id: string
        }
        Insert: {
          assigned_at?: string
          child_profile_id: string
          completed_at?: string | null
          id?: string
          status?: string | null
          task_id: string
        }
        Update: {
          assigned_at?: string
          child_profile_id?: string
          completed_at?: string | null
          id?: string
          status?: string | null
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
      children: {
        Row: {
          age: number
          avatar: string
          created_at: string
          id: string
          interests: string[]
          language: string
          last_active: string
          name: string
          parent_id: string
          pin: string
          streak_days: number
          xp: number
        }
        Insert: {
          age: number
          avatar: string
          created_at?: string
          id?: string
          interests?: string[]
          language?: string
          last_active?: string
          name: string
          parent_id: string
          pin: string
          streak_days?: number
          xp?: number
        }
        Update: {
          age?: number
          avatar?: string
          created_at?: string
          id?: string
          interests?: string[]
          language?: string
          last_active?: string
          name?: string
          parent_id?: string
          pin?: string
          streak_days?: number
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
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
          specialist_id: string
          type: string
        }
        Insert: {
          bookmarked?: boolean
          content: Json
          created_at?: string
          curio_id: string
          id?: string
          liked?: boolean
          specialist_id: string
          type: string
        }
        Update: {
          bookmarked?: boolean
          content?: Json
          created_at?: string
          curio_id?: string
          id?: string
          liked?: boolean
          specialist_id?: string
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
          created_at: string | null
          generation_method: string
          id: string
          image_url: string
          topic: string
        }
        Insert: {
          created_at?: string | null
          generation_method?: string
          id?: string
          image_url: string
          topic: string
        }
        Update: {
          created_at?: string | null
          generation_method?: string
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
          generation_error: string | null
          id: string
          last_revisited: string | null
          last_updated_at: string
          query: string
          revisit_count: number | null
          title: string
        }
        Insert: {
          child_id: string
          created_at?: string
          generation_error?: string | null
          id?: string
          last_revisited?: string | null
          last_updated_at?: string
          query: string
          revisit_count?: number | null
          title: string
        }
        Update: {
          child_id?: string
          created_at?: string
          generation_error?: string | null
          id?: string
          last_revisited?: string | null
          last_updated_at?: string
          query?: string
          revisit_count?: number | null
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
          comprehension_level: string | null
          content_block_ids: string[] | null
          created_at: string | null
          curio_id: string | null
          engagement_level: number | null
          id: string
          interaction_date: string
          last_memory_refresh: string | null
          last_revisited: string | null
          memory_decay_rate: number | null
          memory_strength: number | null
          revisit_count: number | null
          subtopics: string[] | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          child_id: string
          comprehension_level?: string | null
          content_block_ids?: string[] | null
          created_at?: string | null
          curio_id?: string | null
          engagement_level?: number | null
          id?: string
          interaction_date?: string
          last_memory_refresh?: string | null
          last_revisited?: string | null
          memory_decay_rate?: number | null
          memory_strength?: number | null
          revisit_count?: number | null
          subtopics?: string[] | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          comprehension_level?: string | null
          content_block_ids?: string[] | null
          created_at?: string | null
          curio_id?: string | null
          engagement_level?: number | null
          id?: string
          interaction_date?: string
          last_memory_refresh?: string | null
          last_revisited?: string | null
          memory_decay_rate?: number | null
          memory_strength?: number | null
          revisit_count?: number | null
          subtopics?: string[] | null
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_history_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_history_curio_id_fkey"
            columns: ["curio_id"]
            isOneToOne: false
            referencedRelation: "curios"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_factors: {
        Row: {
          child_id: string
          created_at: string | null
          factor_name: string
          factor_weight: number
          id: string
          updated_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          factor_name: string
          factor_weight?: number
          id?: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          factor_name?: string
          factor_weight?: number
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_factors_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          subscription_expires_at: string
          subscription_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          subscription_expires_at?: string
          subscription_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          subscription_expires_at?: string
          subscription_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sparks_transactions: {
        Row: {
          amount: number
          block_id: string | null
          child_id: string
          created_at: string
          id: string
          reason: string
        }
        Insert: {
          amount: number
          block_id?: string | null
          child_id: string
          created_at?: string
          id?: string
          reason: string
        }
        Update: {
          amount?: number
          block_id?: string | null
          child_id?: string
          created_at?: string
          id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "sparks_transactions_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "content_blocks"
            referencedColumns: ["id"]
          },
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
          sparks_reward: number | null
          status: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          parent_user_id: string
          sparks_reward?: number | null
          status?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          parent_user_id?: string
          sparks_reward?: number | null
          status?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      topic_connections: {
        Row: {
          child_id: string
          connection_type: string | null
          created_at: string | null
          from_topic: string
          id: string
          strength: number | null
          to_topic: string
          updated_at: string | null
        }
        Insert: {
          child_id: string
          connection_type?: string | null
          created_at?: string | null
          from_topic: string
          id?: string
          strength?: number | null
          to_topic: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          connection_type?: string | null
          created_at?: string | null
          from_topic?: string
          id?: string
          strength?: number | null
          to_topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_connections_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_memory_strength: {
        Args: {
          last_interaction: string
          revisit_count: number
          engagement_level: number
          decay_rate?: number
        }
        Returns: number
      }
      complete_child_task: {
        Args: { task_id: string }
        Returns: undefined
      }
      create_api_usage_logs_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_sparks: {
        Args: { profile_id_input: string; amount_input: number }
        Returns: number
      }
      increment_sparks_balance: {
        Args: { child_id: string; amount: number }
        Returns: undefined
      }
      refresh_memory_strengths: {
        Args: { child_id_param: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
