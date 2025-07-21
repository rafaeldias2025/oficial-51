-- =====================================================
-- MIGRAÇÃO PARA SISTEMA DE CURSOS PREMIUM
-- =====================================================

-- Adiciona coluna is_premium na tabela courses
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Configuração do Hero dos cursos
CREATE TABLE IF NOT EXISTS public.course_hero_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  hero_type TEXT NOT NULL CHECK (hero_type IN ('image', 'video')),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Configuração de exibição dos módulos
CREATE TABLE IF NOT EXISTS public.module_display_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  display_mode TEXT NOT NULL CHECK (display_mode IN ('direct', 'course-based')),
  show_module_activation BOOLEAN DEFAULT true,
  active_modules UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comentários dos cursos
CREATE TABLE IF NOT EXISTS public.course_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Favoritos dos cursos
CREATE TABLE IF NOT EXISTS public.course_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Avaliações dos cursos
CREATE TABLE IF NOT EXISTS public.course_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Badges/Conquistas
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Certificados
CREATE TABLE IF NOT EXISTS public.user_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Playlists de favoritos
CREATE TABLE IF NOT EXISTS public.user_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cursos nas playlists
CREATE TABLE IF NOT EXISTS public.playlist_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.user_playlists(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(playlist_id, course_id)
);

-- Recomendações de cursos
CREATE TABLE IF NOT EXISTS public.course_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  score DECIMAL(3,2) CHECK (score >= 0 AND score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Notificações de cursos
CREATE TABLE IF NOT EXISTS public.course_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Temas dos cursos (modo noturno)
CREATE TABLE IF NOT EXISTS public.course_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  theme_name TEXT NOT NULL,
  is_dark_mode BOOLEAN DEFAULT false,
  theme_colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Analytics dos cursos
CREATE TABLE IF NOT EXISTS public.course_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  total_comments INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.course_hero_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_display_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para course_hero_config
CREATE POLICY "Hero configs are viewable by everyone" ON public.course_hero_config
  FOR SELECT USING (true);

CREATE POLICY "Hero configs are insertable by admins" ON public.course_hero_config
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

CREATE POLICY "Hero configs are updatable by admins" ON public.course_hero_config
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para module_display_config
CREATE POLICY "Module display configs are viewable by everyone" ON public.module_display_config
  FOR SELECT USING (true);

CREATE POLICY "Module display configs are manageable by admins" ON public.module_display_config
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para course_comments
CREATE POLICY "Comments are viewable by everyone" ON public.course_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON public.course_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.course_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.course_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para course_favorites
CREATE POLICY "Favorites are viewable by everyone" ON public.course_favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own favorites" ON public.course_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para course_ratings
CREATE POLICY "Ratings are viewable by everyone" ON public.course_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own ratings" ON public.course_ratings
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para user_badges
CREATE POLICY "Badges are viewable by everyone" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "Badges are manageable by admins" ON public.user_badges
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para user_certificates
CREATE POLICY "Certificates are viewable by everyone" ON public.user_certificates
  FOR SELECT USING (true);

CREATE POLICY "Certificates are manageable by admins" ON public.user_certificates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para user_playlists
CREATE POLICY "Users can view their own playlists" ON public.user_playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own playlists" ON public.user_playlists
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para playlist_courses
CREATE POLICY "Users can view their playlist courses" ON public.playlist_courses
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_playlists WHERE id = playlist_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their playlist courses" ON public.playlist_courses
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_playlists WHERE id = playlist_id AND user_id = auth.uid()
  ));

-- Políticas RLS para course_recommendations
CREATE POLICY "Users can view their own recommendations" ON public.course_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Recommendations are manageable by admins" ON public.course_recommendations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para course_notifications
CREATE POLICY "Users can view their own notifications" ON public.course_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.course_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Notifications are insertable by admins" ON public.course_notifications
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para course_themes
CREATE POLICY "Course themes are viewable by everyone" ON public.course_themes
  FOR SELECT USING (true);

CREATE POLICY "Course themes are manageable by admins" ON public.course_themes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Políticas RLS para course_analytics
CREATE POLICY "Course analytics are viewable by everyone" ON public.course_analytics
  FOR SELECT USING (true);

CREATE POLICY "Course analytics are manageable by admins" ON public.course_analytics
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com')
  ));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_courses_is_premium ON courses(is_premium);
CREATE INDEX IF NOT EXISTS idx_course_hero_config_course_id ON course_hero_config(course_id);
CREATE INDEX IF NOT EXISTS idx_module_display_config_course_id ON module_display_config(course_id);
CREATE INDEX IF NOT EXISTS idx_course_comments_course_id ON course_comments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_comments_user_id ON course_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_favorites_course_id ON course_favorites(course_id);
CREATE INDEX IF NOT EXISTS idx_course_favorites_user_id ON course_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_course_id ON course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_user_id ON course_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
-- Removido índice de course_id pois a tabela user_badges não tem essa coluna
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON user_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_course_id ON user_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_user_playlists_user_id ON user_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_courses_playlist_id ON playlist_courses(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_courses_course_id ON playlist_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_user_id ON course_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_course_id ON course_recommendations(course_id);
CREATE INDEX IF NOT EXISTS idx_course_notifications_user_id ON course_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_course_notifications_course_id ON course_notifications(course_id);
CREATE INDEX IF NOT EXISTS idx_course_themes_course_id ON course_themes(course_id);
CREATE INDEX IF NOT EXISTS idx_course_analytics_course_id ON course_analytics(course_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_hero_config_updated_at
  BEFORE UPDATE ON public.course_hero_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_display_config_updated_at
  BEFORE UPDATE ON public.module_display_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_comments_updated_at
  BEFORE UPDATE ON public.course_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_ratings_updated_at
  BEFORE UPDATE ON public.course_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_playlists_updated_at
  BEFORE UPDATE ON public.user_playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_themes_updated_at
  BEFORE UPDATE ON public.course_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar analytics
CREATE OR REPLACE FUNCTION update_course_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.course_analytics (
    course_id,
    total_views,
    total_completions,
    average_rating,
    total_comments,
    total_favorites,
    engagement_score
  )
  SELECT
    NEW.course_id,
    COALESCE((SELECT COUNT(*) FROM user_course_progress WHERE course_id = NEW.course_id), 0),
    COALESCE((SELECT COUNT(*) FROM user_course_progress WHERE course_id = NEW.course_id AND progress = 100), 0),
    COALESCE((SELECT AVG(rating) FROM course_ratings WHERE course_id = NEW.course_id), 0),
    COALESCE((SELECT COUNT(*) FROM course_comments WHERE course_id = NEW.course_id), 0),
    COALESCE((SELECT COUNT(*) FROM course_favorites WHERE course_id = NEW.course_id), 0),
    0 -- Cálculo do engagement_score será implementado posteriormente
  ON CONFLICT (course_id) DO UPDATE
  SET
    total_views = EXCLUDED.total_views,
    total_completions = EXCLUDED.total_completions,
    average_rating = EXCLUDED.average_rating,
    total_comments = EXCLUDED.total_comments,
    total_favorites = EXCLUDED.total_favorites,
    engagement_score = EXCLUDED.engagement_score,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar analytics
CREATE TRIGGER update_analytics_on_progress
  AFTER INSERT OR UPDATE ON public.user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_course_analytics();

CREATE TRIGGER update_analytics_on_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.course_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_course_analytics();

CREATE TRIGGER update_analytics_on_comment
  AFTER INSERT OR DELETE ON public.course_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_course_analytics();

CREATE TRIGGER update_analytics_on_favorite
  AFTER INSERT OR DELETE ON public.course_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_course_analytics(); 