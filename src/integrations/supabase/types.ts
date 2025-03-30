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
      block_replies: {
        Row: {
          block_id: string
          content: string
          created_at: string
          from_user: boolean
          id: string
        }
        Insert: {
          block_id: string
          content: string
          created_at?: string
          from_user?: boolean
          id?: string
        }
        Update: {
          block_id?: string
          content?: string
          created_at?: string
          from_user?: boolean
          id?: string
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
          created_at: string
          grade: string | null
          id: string
          interests: string[] | null
          language: string | null
          last_active: string | null
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
          created_at?: string
          grade?: string | null
          id?: string
          interests?: string[] | null
          language?: string | null
          last_active?: string | null
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
          created_at?: string
          grade?: string | null
          id?: string
          interests?: string[] | null
          language?: string | null
          last_active?: string | null
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
      curios: {
        Row: {
          child_id: string
          created_at: string
          id: string
          last_updated_at: string
          query: string
          title: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          last_updated_at?: string
          query: string
          title: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          last_updated_at?: string
          query?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
