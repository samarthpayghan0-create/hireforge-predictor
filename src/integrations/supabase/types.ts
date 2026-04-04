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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      app_ratings: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_ratings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_recommendations: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          recommendations: Json
          roadmap: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          recommendations?: Json
          roadmap?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          recommendations?: Json
          roadmap?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_leaderboard: {
        Row: {
          created_at: string
          easy_solved: number
          hard_solved: number
          id: string
          medium_solved: number
          preferred_language: string | null
          problems_solved: number
          profile_id: string | null
          success_rate: number | null
          total_score: number
          updated_at: string
          user_id: string | null
          username: string
        }
        Insert: {
          created_at?: string
          easy_solved?: number
          hard_solved?: number
          id?: string
          medium_solved?: number
          preferred_language?: string | null
          problems_solved?: number
          profile_id?: string | null
          success_rate?: number | null
          total_score?: number
          updated_at?: string
          user_id?: string | null
          username: string
        }
        Update: {
          created_at?: string
          easy_solved?: number
          hard_solved?: number
          id?: string
          medium_solved?: number
          preferred_language?: string | null
          problems_solved?: number
          profile_id?: string | null
          success_rate?: number | null
          total_score?: number
          updated_at?: string
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "coding_leaderboard_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_problems: {
        Row: {
          category: string | null
          company_tags: string[] | null
          constraints: string | null
          created_at: string
          description: string
          difficulty: string
          id: string
          points: number | null
          sample_input: string | null
          sample_output: string | null
          test_cases: Json
          title: string
        }
        Insert: {
          category?: string | null
          company_tags?: string[] | null
          constraints?: string | null
          created_at?: string
          description: string
          difficulty?: string
          id?: string
          points?: number | null
          sample_input?: string | null
          sample_output?: string | null
          test_cases?: Json
          title: string
        }
        Update: {
          category?: string | null
          company_tags?: string[] | null
          constraints?: string | null
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          points?: number | null
          sample_input?: string | null
          sample_output?: string | null
          test_cases?: Json
          title?: string
        }
        Relationships: []
      }
      coding_submissions: {
        Row: {
          ai_feedback: string | null
          code: string
          created_at: string
          execution_time_ms: number | null
          id: string
          is_correct: boolean | null
          language: string
          problem_id: string | null
          profile_id: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          ai_feedback?: string | null
          code: string
          created_at?: string
          execution_time_ms?: number | null
          id?: string
          is_correct?: boolean | null
          language: string
          problem_id?: string | null
          profile_id?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          ai_feedback?: string | null
          code?: string
          created_at?: string
          execution_time_ms?: number | null
          id?: string
          is_correct?: boolean | null
          language?: string
          problem_id?: string | null
          profile_id?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coding_submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coding_submissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_scores: {
        Row: {
          clarity_score: number | null
          confidence_score: number | null
          created_at: string
          fluency_score: number | null
          id: string
          overall_score: number | null
          profile_id: string | null
          speaking_speed: number | null
          transcript: string | null
        }
        Insert: {
          clarity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          id?: string
          overall_score?: number | null
          profile_id?: string | null
          speaking_speed?: number | null
          transcript?: string | null
        }
        Update: {
          clarity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          id?: string
          overall_score?: number | null
          profile_id?: string | null
          speaking_speed?: number | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_scores_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_interviews: {
        Row: {
          answers: Json
          category: string
          created_at: string
          feedback: Json
          id: string
          overall_score: number | null
          profile_id: string | null
          questions: Json
          scores: Json
          user_id: string | null
        }
        Insert: {
          answers?: Json
          category?: string
          created_at?: string
          feedback?: Json
          id?: string
          overall_score?: number | null
          profile_id?: string | null
          questions?: Json
          scores?: Json
          user_id?: string | null
        }
        Update: {
          answers?: Json
          category?: string
          created_at?: string
          feedback?: Json
          id?: string
          overall_score?: number | null
          profile_id?: string | null
          questions?: Json
          scores?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_interviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_scores: {
        Row: {
          category: string
          created_at: string
          id: string
          profile_id: string | null
          score: number
          total_questions: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          profile_id?: string | null
          score: number
          total_questions: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          profile_id?: string | null
          score?: number
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_scores_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_analyses: {
        Row: {
          certifications: string[] | null
          created_at: string
          detected_skills: string[] | null
          education: string[] | null
          experience_score: number | null
          id: string
          keywords_score: number | null
          missing_skills: string[] | null
          profile_id: string | null
          projects: string[] | null
          projects_score: number | null
          raw_text: string | null
          resume_score: number | null
          resume_url: string | null
          skills_score: number | null
          suggestions: string[] | null
          user_id: string | null
          work_experience: string[] | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string
          detected_skills?: string[] | null
          education?: string[] | null
          experience_score?: number | null
          id?: string
          keywords_score?: number | null
          missing_skills?: string[] | null
          profile_id?: string | null
          projects?: string[] | null
          projects_score?: number | null
          raw_text?: string | null
          resume_score?: number | null
          resume_url?: string | null
          skills_score?: number | null
          suggestions?: string[] | null
          user_id?: string | null
          work_experience?: string[] | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string
          detected_skills?: string[] | null
          education?: string[] | null
          experience_score?: number | null
          id?: string
          keywords_score?: number | null
          missing_skills?: string[] | null
          profile_id?: string | null
          projects?: string[] | null
          projects_score?: number | null
          raw_text?: string | null
          resume_score?: number | null
          resume_url?: string | null
          skills_score?: number | null
          suggestions?: string[] | null
          user_id?: string | null
          work_experience?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_analyses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          aptitude_score: number
          avatar_url: string | null
          cgpa: number
          communication_rating: number
          created_at: string
          dsa_score: number
          id: string
          internship_experience: number
          name: string
          num_projects: number
          programming_skills: string[] | null
          resume_url: string | null
          technical_skills: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          aptitude_score: number
          avatar_url?: string | null
          cgpa: number
          communication_rating: number
          created_at?: string
          dsa_score: number
          id?: string
          internship_experience?: number
          name: string
          num_projects?: number
          programming_skills?: string[] | null
          resume_url?: string | null
          technical_skills?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          aptitude_score?: number
          avatar_url?: string | null
          cgpa?: number
          communication_rating?: number
          created_at?: string
          dsa_score?: number
          id?: string
          internship_experience?: number
          name?: string
          num_projects?: number
          programming_skills?: string[] | null
          resume_url?: string | null
          technical_skills?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile_ids: { Args: { _user_id: string }; Returns: string[] }
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
