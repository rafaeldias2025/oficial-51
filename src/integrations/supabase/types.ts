export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      additional_features_config: {
        Row: {
          course_id: string | null
          created_at: string | null
          enable_badges: boolean | null
          enable_certificates: boolean | null
          enable_dark_mode: boolean | null
          enable_playlists: boolean | null
          enable_visual_progress: boolean | null
          id: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          enable_badges?: boolean | null
          enable_certificates?: boolean | null
          enable_dark_mode?: boolean | null
          enable_playlists?: boolean | null
          enable_visual_progress?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          enable_badges?: boolean | null
          enable_certificates?: boolean | null
          enable_dark_mode?: boolean | null
          enable_playlists?: boolean | null
          enable_visual_progress?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "additional_features_config_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_analytics_config: {
        Row: {
          course_id: string | null
          created_at: string | null
          enable_analytics: boolean | null
          enable_export: boolean | null
          enable_reports: boolean | null
          id: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          enable_analytics?: boolean | null
          enable_export?: boolean | null
          enable_reports?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          enable_analytics?: boolean | null
          enable_export?: boolean | null
          enable_reports?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_analytics_config_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          target_id: string
          target_table: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          target_id: string
          target_table: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          target_id?: string
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string | null
          created_at: string | null
          description: string | null
          duration_days: number | null
          id: string
          is_active: boolean | null
          points: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      course_analytics: {
        Row: {
          average_rating: number | null
          course_id: string | null
          created_at: string | null
          id: string
          total_completions: number | null
          total_enrollments: number | null
          total_revenue: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          total_completions?: number | null
          total_enrollments?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          total_completions?: number | null
          total_enrollments?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_analytics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_comments: {
        Row: {
          comment: string
          course_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_comments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_favorites: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_favorites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_hero_config: {
        Row: {
          course_id: string | null
          created_at: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          hero_type: string | null
          hero_video_url: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          hero_type?: string | null
          hero_video_url?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          hero_type?: string | null
          hero_video_url?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_hero_config_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          content_text: string | null
          created_at: string | null
          description: string | null
          document_url: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          metadata: Json | null
          module_id: string | null
          order_index: number | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content_text?: string | null
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          module_id?: string | null
          order_index?: number | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content_text?: string | null
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          module_id?: string | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          estimated_duration: number | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_notifications: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_notifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_ratings: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          review: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_ratings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_recommendations: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_themes: {
        Row: {
          background_color: string | null
          course_id: string | null
          created_at: string | null
          id: string
          is_dark_mode: boolean | null
          primary_color: string | null
          secondary_color: string | null
          text_color: string | null
          theme_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          background_color?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_dark_mode?: boolean | null
          primary_color?: string | null
          secondary_color?: string | null
          text_color?: string | null
          theme_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          background_color?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_dark_mode?: boolean | null
          primary_color?: string | null
          secondary_color?: string | null
          text_color?: string | null
          theme_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_themes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          instructor_name: string | null
          is_active: boolean | null
          is_premium: boolean | null
          price: number | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_name?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          price?: number | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_name?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          price?: number | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dados_fisicos_usuario: {
        Row: {
          altura_cm: number | null
          categoria_imc: string | null
          circunferencia_abdominal_cm: number | null
          created_at: string | null
          data_medicao: string | null
          data_nascimento: string | null
          id: string
          imc: number | null
          nome_completo: string | null
          peso_atual_kg: number | null
          risco_cardiometabolico: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          altura_cm?: number | null
          categoria_imc?: string | null
          circunferencia_abdominal_cm?: number | null
          created_at?: string | null
          data_medicao?: string | null
          data_nascimento?: string | null
          id?: string
          imc?: number | null
          nome_completo?: string | null
          peso_atual_kg?: number | null
          risco_cardiometabolico?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          altura_cm?: number | null
          categoria_imc?: string | null
          circunferencia_abdominal_cm?: number | null
          created_at?: string | null
          data_medicao?: string | null
          data_nascimento?: string | null
          id?: string
          imc?: number | null
          nome_completo?: string | null
          peso_atual_kg?: number | null
          risco_cardiometabolico?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dados_saude_usuario: {
        Row: {
          colesterol_total: number | null
          created_at: string | null
          data_medicao: string | null
          frequencia_cardiaca: number | null
          glicemia_mg_dl: number | null
          hdl: number | null
          id: string
          ldl: number | null
          peso_atual_kg: number | null
          pressao_diastolica: number | null
          pressao_sistolica: number | null
          progresso_percentual: number | null
          triglicerideos: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          colesterol_total?: number | null
          created_at?: string | null
          data_medicao?: string | null
          frequencia_cardiaca?: number | null
          glicemia_mg_dl?: number | null
          hdl?: number | null
          id?: string
          ldl?: number | null
          peso_atual_kg?: number | null
          pressao_diastolica?: number | null
          pressao_sistolica?: number | null
          progresso_percentual?: number | null
          triglicerideos?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          colesterol_total?: number | null
          created_at?: string | null
          data_medicao?: string | null
          frequencia_cardiaca?: number | null
          glicemia_mg_dl?: number | null
          hdl?: number | null
          id?: string
          ldl?: number | null
          peso_atual_kg?: number | null
          pressao_diastolica?: number | null
          pressao_sistolica?: number | null
          progresso_percentual?: number | null
          triglicerideos?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          mission_date: string | null
          mission_id: string | null
          points_earned: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          mission_date?: string | null
          mission_id?: string | null
          points_earned?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          mission_date?: string | null
          mission_id?: string | null
          points_earned?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          content: string | null
          created_at: string | null
          entry_date: string | null
          id: string
          mood: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          entry_date?: string | null
          id?: string
          mood?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          entry_date?: string | null
          id?: string
          mood?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          id: string
          prioridade: string | null
          status: string | null
          tipo_meta: string | null
          titulo: string
          unidade: string | null
          updated_at: string | null
          user_id: string | null
          valor_atual: number | null
          valor_meta: number | null
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          status?: string | null
          tipo_meta?: string | null
          titulo: string
          unidade?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor_atual?: number | null
          valor_meta?: number | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          status?: string | null
          tipo_meta?: string | null
          titulo?: string
          unidade?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor_atual?: number | null
          valor_meta?: number | null
        }
        Relationships: []
      }
      google_fit_data: {
        Row: {
          created_at: string | null
          data_medicao: string | null
          fonte_dados: string | null
          id: string
          sincronizado: boolean | null
          tipo_dado: string | null
          unidade: string | null
          updated_at: string | null
          user_id: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          data_medicao?: string | null
          fonte_dados?: string | null
          id?: string
          sincronizado?: boolean | null
          tipo_dado?: string | null
          unidade?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          data_medicao?: string | null
          fonte_dados?: string | null
          id?: string
          sincronizado?: boolean | null
          tipo_dado?: string | null
          unidade?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      historico_medidas: {
        Row: {
          circunferencia_abdominal_cm: number | null
          circunferencia_braco_cm: number | null
          circunferencia_perna_cm: number | null
          created_at: string | null
          data_medicao: string | null
          id: string
          peso_kg: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          circunferencia_abdominal_cm?: number | null
          circunferencia_braco_cm?: number | null
          circunferencia_perna_cm?: number | null
          created_at?: string | null
          data_medicao?: string | null
          id?: string
          peso_kg?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          circunferencia_abdominal_cm?: number | null
          circunferencia_braco_cm?: number | null
          circunferencia_perna_cm?: number | null
          created_at?: string | null
          data_medicao?: string | null
          id?: string
          peso_kg?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      missao_dia: {
        Row: {
          concluida: boolean | null
          created_at: string | null
          data_conclusao: string | null
          data_missao: string | null
          descricao: string | null
          humor: string | null
          id: string
          inspira: string | null
          liquido_ao_acordar: boolean | null
          pontos_recompensa: number | null
          prioridades: string[] | null
          tipo_missao: string | null
          titulo: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          concluida?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          data_missao?: string | null
          descricao?: string | null
          humor?: string | null
          id?: string
          inspira?: string | null
          liquido_ao_acordar?: boolean | null
          pontos_recompensa?: number | null
          prioridades?: string[] | null
          tipo_missao?: string | null
          titulo?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          concluida?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          data_missao?: string | null
          descricao?: string | null
          humor?: string | null
          id?: string
          inspira?: string | null
          liquido_ao_acordar?: boolean | null
          pontos_recompensa?: number | null
          prioridades?: string[] | null
          tipo_missao?: string | null
          titulo?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      missoes_usuario: {
        Row: {
          autocuidado: boolean | null
          bebeu_agua: boolean | null
          created_at: string | null
          data: string | null
          dormiu_bem: boolean | null
          humor: string | null
          id: string
          observacoes: string | null
          pontos_conquistados: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          autocuidado?: boolean | null
          bebeu_agua?: boolean | null
          created_at?: string | null
          data?: string | null
          dormiu_bem?: boolean | null
          humor?: string | null
          id?: string
          observacoes?: string | null
          pontos_conquistados?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          autocuidado?: boolean | null
          bebeu_agua?: boolean | null
          created_at?: string | null
          data?: string | null
          dormiu_bem?: boolean | null
          humor?: string | null
          id?: string
          observacoes?: string | null
          pontos_conquistados?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      module_display_config: {
        Row: {
          course_id: string | null
          created_at: string | null
          display_mode: string | null
          id: string
          show_module_activation: boolean | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          display_mode?: string | null
          id?: string
          show_module_activation?: boolean | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          display_mode?: string | null
          id?: string
          show_module_activation?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_display_config_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      pesagens: {
        Row: {
          created_at: string | null
          data_medicao: string | null
          data_pesagem: string | null
          dispositivo_id: string | null
          fonte_dados: string | null
          hora_pesagem: string | null
          id: string
          observacoes: string | null
          peso_kg: number
          sincronizado_com_google_fit: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_medicao?: string | null
          data_pesagem?: string | null
          dispositivo_id?: string | null
          fonte_dados?: string | null
          hora_pesagem?: string | null
          id?: string
          observacoes?: string | null
          peso_kg: number
          sincronizado_com_google_fit?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_medicao?: string | null
          data_pesagem?: string | null
          dispositivo_id?: string | null
          fonte_dados?: string | null
          hora_pesagem?: string | null
          id?: string
          observacoes?: string | null
          peso_kg?: number
          sincronizado_com_google_fit?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      playlist_courses: {
        Row: {
          added_at: string | null
          course_id: string | null
          id: string
          playlist_id: string | null
        }
        Insert: {
          added_at?: string | null
          course_id?: string | null
          id?: string
          playlist_id?: string | null
        }
        Update: {
          added_at?: string | null
          course_id?: string | null
          id?: string
          playlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_courses_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "user_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      pontuacao_diaria: {
        Row: {
          created_at: string | null
          data_pontuacao: string | null
          id: string
          meta_diaria: number | null
          pontos_alimentacao: number | null
          pontos_avaliacao_dia: number | null
          pontos_estresse: number | null
          pontos_exercicio: number | null
          pontos_fome_emocional: number | null
          pontos_gerais: number | null
          pontos_hidratacao: number | null
          pontos_sono: number | null
          total_pontos_dia: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_pontuacao?: string | null
          id?: string
          meta_diaria?: number | null
          pontos_alimentacao?: number | null
          pontos_avaliacao_dia?: number | null
          pontos_estresse?: number | null
          pontos_exercicio?: number | null
          pontos_fome_emocional?: number | null
          pontos_gerais?: number | null
          pontos_hidratacao?: number | null
          pontos_sono?: number | null
          total_pontos_dia?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_pontuacao?: string | null
          id?: string
          meta_diaria?: number | null
          pontos_alimentacao?: number | null
          pontos_avaliacao_dia?: number | null
          pontos_estresse?: number | null
          pontos_exercicio?: number | null
          pontos_fome_emocional?: number | null
          pontos_gerais?: number | null
          pontos_hidratacao?: number | null
          pontos_sono?: number | null
          total_pontos_dia?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          calorias_estimadas: number | null
          concluida: boolean | null
          created_at: string | null
          data_sessao: string | null
          descricao: string | null
          duracao_minutos: number | null
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          intensidade: string | null
          observacoes: string | null
          tipo_sessao: string | null
          titulo: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calorias_estimadas?: number | null
          concluida?: boolean | null
          created_at?: string | null
          data_sessao?: string | null
          descricao?: string | null
          duracao_minutos?: number | null
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          intensidade?: string | null
          observacoes?: string | null
          tipo_sessao?: string | null
          titulo: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calorias_estimadas?: number | null
          concluida?: boolean | null
          created_at?: string | null
          data_sessao?: string | null
          descricao?: string | null
          duracao_minutos?: number | null
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          intensidade?: string | null
          observacoes?: string | null
          tipo_sessao?: string | null
          titulo?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_features_config: {
        Row: {
          course_id: string | null
          created_at: string | null
          enable_comments: boolean | null
          enable_favorites: boolean | null
          enable_ratings: boolean | null
          enable_recommendations: boolean | null
          id: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          enable_comments?: boolean | null
          enable_favorites?: boolean | null
          enable_ratings?: boolean | null
          enable_recommendations?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          enable_comments?: boolean | null
          enable_favorites?: boolean | null
          enable_ratings?: boolean | null
          enable_recommendations?: boolean | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_features_config_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_name: string
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_description?: string | null
          badge_name: string
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_description?: string | null
          badge_name?: string
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certificates: {
        Row: {
          certificate_url: string | null
          course_id: string | null
          id: string
          issued_at: string | null
          user_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          progress: number | null
          started_at: string | null
          target_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          started_at?: string | null
          target_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          started_at?: string | null
          target_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          completed_lessons: number | null
          course_id: string | null
          id: string
          progress_percentage: number | null
          started_at: string | null
          total_lessons: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_lessons?: number | null
          course_id?: string | null
          id?: string
          progress_percentage?: number | null
          started_at?: string | null
          total_lessons?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_lessons?: number | null
          course_id?: string | null
          id?: string
          progress_percentage?: number | null
          started_at?: string | null
          total_lessons?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_google_credentials: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          lesson_id: string | null
          user_id: string | null
          watched_duration: number | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string | null
          user_id?: string | null
          watched_duration?: number | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string | null
          user_id?: string | null
          watched_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_playlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string | null
          historico_pontos: Json | null
          id: string
          nivel_atual: number | null
          pontos_para_proximo_nivel: number | null
          pontos_totais: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          historico_pontos?: Json | null
          id?: string
          nivel_atual?: number | null
          pontos_para_proximo_nivel?: number | null
          pontos_totais?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          historico_pontos?: Json | null
          id?: string
          nivel_atual?: number | null
          pontos_para_proximo_nivel?: number | null
          pontos_totais?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          lesson_id: string | null
          progress_percentage: number | null
          started_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      weekly_evaluations: {
        Row: {
          atingiu_meta: boolean | null
          created_at: string | null
          id: string
          meta_semanal: number | null
          observacoes: string | null
          peso_final: number | null
          peso_inicial: number | null
          semana_fim: string | null
          semana_inicio: string | null
          updated_at: string | null
          user_id: string | null
          variacao_peso: number | null
        }
        Insert: {
          atingiu_meta?: boolean | null
          created_at?: string | null
          id?: string
          meta_semanal?: number | null
          observacoes?: string | null
          peso_final?: number | null
          peso_inicial?: number | null
          semana_fim?: string | null
          semana_inicio?: string | null
          updated_at?: string | null
          user_id?: string | null
          variacao_peso?: number | null
        }
        Update: {
          atingiu_meta?: boolean | null
          created_at?: string | null
          id?: string
          meta_semanal?: number | null
          observacoes?: string | null
          peso_final?: number | null
          peso_inicial?: number | null
          semana_fim?: string | null
          semana_inicio?: string | null
          updated_at?: string | null
          user_id?: string | null
          variacao_peso?: number | null
        }
        Relationships: []
      }
      weight_goals: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          id: string
          meta_peso_kg: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          meta_peso_kg?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          meta_peso_kg?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_categoria_imc: {
        Args: { imc: number }
        Returns: string
      }
      calcular_imc: {
        Args: { peso_kg: number; altura_cm: number }
        Returns: number
      }
      calcular_risco_cardiometabolico: {
        Args: { imc: number; circunferencia_abdominal: number; genero: string }
        Returns: string
      }
      check_physical_data_complete: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      create_complete_user_registration: {
        Args: { user_email: string; user_name: string; user_password: string }
        Returns: string
      }
      execute_user_health_check: {
        Args: { user_uuid: string }
        Returns: Json
      }
      inserir_pesagem_automatica: {
        Args: {
          p_user_id: string
          p_peso_kg: number
          p_dispositivo_id?: string
        }
        Returns: string
      }
      run_data_integrity_monitor: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      sincronizar_com_google_fit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      update_user_points: {
        Args: { points_to_add: number; user_uuid: string }
        Returns: undefined
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

