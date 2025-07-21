import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// Configuração do Hero
export interface HeroConfig {
  id: string;
  course_id: string;
  hero_type: 'image' | 'video';
  hero_title: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  hero_video_url?: string;
  created_at?: string;
  updated_at?: string;
  course?: Tables['courses']['Row'];
}

// Configuração de exibição dos módulos
export interface ModuleConfig {
  id: string;
  course_id: string;
  display_mode: 'direct' | 'course-based';
  show_module_activation: boolean;
  active_modules: string[];
  created_at?: string;
  updated_at?: string;
  course?: Tables['courses']['Row'];
}

// Comentários
export interface Comment {
  id: string;
  course_id: string;
  user_id: string;
  comment: string;
  created_at?: string;
  updated_at?: string;
  course?: Tables['courses']['Row'];
  profiles?: Tables['profiles']['Row'];
}

// Favoritos
export interface Favorite {
  id: string;
  course_id: string;
  user_id: string;
  created_at?: string;
  course?: Tables['courses']['Row'];
  profiles?: Tables['profiles']['Row'];
}

// Avaliações
export interface Rating {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  created_at?: string;
  updated_at?: string;
  course?: Tables['courses']['Row'];
  profiles?: Tables['profiles']['Row'];
}

// Badges/Conquistas
export interface Badge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  badge_type: string;
  earned_at?: string;
  created_at?: string;
  profiles?: Tables['profiles']['Row'];
}

// Certificados
export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string;
  issued_at?: string;
  expires_at?: string;
  is_valid?: boolean;
  created_at?: string;
  course?: Tables['courses']['Row'];
  profiles?: Tables['profiles']['Row'];
}

// Playlists
export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  profiles?: Tables['profiles']['Row'];
  playlist_courses?: Array<{
    course: Tables['courses']['Row'];
  }>;
}

// Recomendações
export interface Recommendation {
  id: string;
  user_id: string;
  course_id: string;
  reason: string;
  score: number;
  created_at?: string;
  course?: Tables['courses']['Row'];
  profiles?: Tables['profiles']['Row'];
}

// Notificações
export interface Notification {
  id: string;
  user_id: string;
  course_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at?: string;
  course?: Tables['courses']['Row'];
  profiles?: Tables['profiles']['Row'];
}

// Temas
export interface Theme {
  id: string;
  course_id: string;
  theme_name: string;
  is_dark_mode: boolean;
  theme_colors?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  course?: Tables['courses']['Row'];
}

// Analytics
export interface Analytics {
  id: string;
  course_id: string;
  total_views: number;
  total_completions: number;
  average_rating?: number;
  total_comments: number;
  total_favorites: number;
  engagement_score?: number;
  updated_at?: string;
  course?: Tables['courses']['Row'];
}

// Curso Premium
export interface PremiumCourse {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  price?: number;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  is_premium: boolean;
  hero_config?: HeroConfig;
  module_config?: ModuleConfig;
  comments?: Comment[];
  favorites?: Favorite[];
  ratings?: Rating[];
  badges?: Badge[];
  certificates?: Certificate[];
  recommendations?: Recommendation[];
  notifications?: Notification[];
  theme?: Theme;
  analytics?: Analytics;
  average_rating?: number;
  total_comments?: number;
  total_favorites?: number;
  completion_rate?: number;
} 