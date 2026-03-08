export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      health_connections: {
        Row: {
          created_at: string;
          external_subject_id: string | null;
          id: string;
          last_synced_at: string | null;
          provider: string;
          status: Database["public"]["Enums"]["connection_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          external_subject_id?: string | null;
          id?: string;
          last_synced_at?: string | null;
          provider: string;
          status?: Database["public"]["Enums"]["connection_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["health_connections"]["Insert"]>;
        Relationships: [];
      };
      habit_logs: {
        Row: {
          created_at: string;
          id: string;
          log_date: string;
          note: string | null;
          plan_habit_id: string;
          progress_value: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          log_date: string;
          note?: string | null;
          plan_habit_id: string;
          progress_value?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["habit_logs"]["Insert"]>;
        Relationships: [];
      };
      league_invites: {
        Row: {
          code: string;
          created_at: string;
          created_by: string;
          expires_at: string | null;
          id: string;
          league_id: string;
          max_uses: number | null;
          use_count: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by: string;
          expires_at?: string | null;
          id?: string;
          league_id: string;
          max_uses?: number | null;
          use_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["league_invites"]["Insert"]>;
        Relationships: [];
      };
      league_members: {
        Row: {
          id: string;
          joined_at: string;
          league_id: string;
          role: Database["public"]["Enums"]["league_member_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string;
          league_id: string;
          role?: Database["public"]["Enums"]["league_member_role"];
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["league_members"]["Insert"]>;
        Relationships: [];
      };
      league_weeks: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          league_id: string;
          start_date: string;
          status: Database["public"]["Enums"]["league_week_status"];
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          league_id: string;
          start_date: string;
          status?: Database["public"]["Enums"]["league_week_status"];
        };
        Update: Partial<Database["public"]["Tables"]["league_weeks"]["Insert"]>;
        Relationships: [];
      };
      leagues: {
        Row: {
          created_at: string;
          id: string;
          invite_code: string;
          name: string;
          owner_id: string;
          updated_at: string;
          weekly_point_budget: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invite_code: string;
          name: string;
          owner_id: string;
          updated_at?: string;
          weekly_point_budget?: number;
        };
        Update: Partial<Database["public"]["Tables"]["leagues"]["Insert"]>;
        Relationships: [];
      };
      plan_categories: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          name: string;
          sort_order: number;
          user_week_plan_id: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          id?: string;
          name: string;
          sort_order?: number;
          user_week_plan_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["plan_categories"]["Insert"]>;
        Relationships: [];
      };
      plan_habits: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          metric_type: Database["public"]["Enums"]["goal_metric"];
          name: string;
          point_value: number;
          sort_order: number;
          target_value: number;
          tracking_source: Database["public"]["Enums"]["tracking_source"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          metric_type?: Database["public"]["Enums"]["goal_metric"];
          name: string;
          point_value: number;
          sort_order?: number;
          target_value: number;
          tracking_source?: Database["public"]["Enums"]["tracking_source"];
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["plan_habits"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string;
          id: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_week_plans: {
        Row: {
          created_at: string;
          id: string;
          is_locked: boolean;
          league_week_id: string;
          point_budget: number;
          points_allocated: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_locked?: boolean;
          league_week_id: string;
          point_budget: number;
          points_allocated?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_week_plans"]["Insert"]>;
        Relationships: [];
      };
      weekly_scores: {
        Row: {
          id: string;
          league_week_id: string;
          rank: number | null;
          total_points: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          league_week_id: string;
          rank?: number | null;
          total_points?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["weekly_scores"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_league_member: {
        Args: { target_league_id: string };
        Returns: boolean;
      };
      redeem_league_invite: {
        Args: { invite_code_input: string };
        Returns: string;
      };
    };
    Enums: {
      connection_status: "disconnected" | "connected" | "error";
      goal_metric: "count" | "duration_minutes" | "binary" | "steps" | "sleep_hours";
      league_member_role: "owner" | "member";
      league_week_status: "draft" | "active" | "closed";
      tracking_source: "manual" | "apple_health";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
