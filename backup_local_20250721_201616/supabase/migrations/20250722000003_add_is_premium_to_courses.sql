-- Adiciona coluna is_premium à tabela courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Cria índice para is_premium
CREATE INDEX IF NOT EXISTS idx_courses_is_premium ON courses(is_premium); 

-- Inserir cursos de exemplo após a criação da coluna is_premium
INSERT INTO courses (id, title, description, image_url, is_premium, price) VALUES 
('11111111-1111-1111-1111-111111111111', 'Curso de Nutrição Básica', 'Aprenda os fundamentos da nutrição saudável', '/assets/course-nutrition.jpg', false, 0.00),
('22222222-2222-2222-2222-222222222222', 'Fitness Avançado', 'Treinos intensivos para resultados rápidos', '/assets/course-fitness.jpg', true, 99.90),
('33333333-3333-3333-3333-333333333333', 'Mindfulness e Meditação', 'Técnicas para paz interior e foco mental', '/assets/course-mindfulness.jpg', true, 79.90),
('44444444-4444-4444-4444-444444444444', 'Psicologia do Bem-estar', 'Entenda sua mente e melhore sua qualidade de vida', '/assets/course-psychology.jpg', true, 129.90),
('55555555-5555-5555-5555-555555555555', 'Bem-estar Integral', 'Abordagem holística para uma vida equilibrada', '/assets/course-wellness.jpg', false, 0.00)
ON CONFLICT (id) DO NOTHING; 

-- Configurações iniciais para cursos de exemplo
INSERT INTO course_hero_config (course_id, hero_type, hero_title, hero_subtitle) VALUES 
('11111111-1111-1111-1111-111111111111', 'image', 'Nutrição Básica', 'Fundamentos para uma vida saudável'),
('22222222-2222-2222-2222-222222222222', 'video', 'Fitness Avançado', 'Transforme seu corpo e mente'),
('33333333-3333-3333-3333-333333333333', 'image', 'Mindfulness', 'Encontre paz interior'),
('44444444-4444-4444-4444-444444444444', 'image', 'Psicologia do Bem-estar', 'Entenda sua mente'),
('55555555-5555-5555-5555-555555555555', 'image', 'Bem-estar Integral', 'Vida equilibrada e saudável')
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO module_display_config (course_id, display_mode, show_module_activation) VALUES 
('11111111-1111-1111-1111-111111111111', 'course_based', true),
('22222222-2222-2222-2222-222222222222', 'direct', true),
('33333333-3333-3333-3333-333333333333', 'course_based', true),
('44444444-4444-4444-4444-444444444444', 'direct', true),
('55555555-5555-5555-5555-555555555555', 'course_based', true)
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO social_features_config (course_id, enable_comments, enable_ratings, enable_favorites, enable_recommendations) VALUES 
('11111111-1111-1111-1111-111111111111', true, true, true, true),
('22222222-2222-2222-2222-222222222222', true, true, true, true),
('33333333-3333-3333-3333-333333333333', true, true, true, true),
('44444444-4444-4444-4444-444444444444', true, true, true, true),
('55555555-5555-5555-5555-555555555555', true, true, true, true)
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO additional_features_config (course_id, enable_visual_progress, enable_certificates, enable_badges, enable_playlists, enable_dark_mode) VALUES 
('11111111-1111-1111-1111-111111111111', true, true, true, true, true),
('22222222-2222-2222-2222-222222222222', true, true, true, true, true),
('33333333-3333-3333-3333-333333333333', true, true, true, true, true),
('44444444-4444-4444-4444-444444444444', true, true, true, true, true),
('55555555-5555-5555-5555-555555555555', true, true, true, true, true)
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO admin_analytics_config (course_id, enable_analytics, enable_export, enable_reports) VALUES 
('11111111-1111-1111-1111-111111111111', true, true, true),
('22222222-2222-2222-2222-222222222222', true, true, true),
('33333333-3333-3333-3333-333333333333', true, true, true),
('44444444-4444-4444-4444-444444444444', true, true, true),
('55555555-5555-5555-5555-555555555555', true, true, true)
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO course_themes (course_id, theme_name, primary_color, secondary_color, background_color, text_color, is_dark_mode) VALUES 
('11111111-1111-1111-1111-111111111111', 'Nutrição Verde', '#10B981', '#065F46', '#FFFFFF', '#1F2937', false),
('22222222-2222-2222-2222-222222222222', 'Fitness Azul', '#3B82F6', '#1E40AF', '#FFFFFF', '#1F2937', false),
('33333333-3333-3333-3333-333333333333', 'Mindfulness Roxo', '#8B5CF6', '#5B21B6', '#FFFFFF', '#1F2937', false),
('44444444-4444-4444-4444-444444444444', 'Psicologia Laranja', '#F59E0B', '#D97706', '#FFFFFF', '#1F2937', false),
('55555555-5555-5555-5555-555555555555', 'Bem-estar Rosa', '#EC4899', '#BE185D', '#FFFFFF', '#1F2937', false)
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO course_analytics (course_id, total_enrollments, total_completions, average_rating, total_reviews, total_revenue) VALUES 
('11111111-1111-1111-1111-111111111111', 150, 120, 4.5, 45, 0.00),
('22222222-2222-2222-2222-222222222222', 89, 67, 4.8, 32, 6683.30),
('33333333-3333-3333-3333-333333333333', 234, 189, 4.7, 78, 14981.10),
('44444444-4444-4444-4444-444444444444', 156, 134, 4.6, 56, 17414.40),
('55555555-5555-5555-5555-555555555555', 298, 245, 4.9, 89, 0.00)
ON CONFLICT (course_id) DO NOTHING; 

-- Adicionar coluna user_id à tabela course_themes que foi criada na migração inicial sem essa coluna
ALTER TABLE course_themes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE course_themes DROP CONSTRAINT IF EXISTS course_themes_course_id_key;
ALTER TABLE course_themes ADD CONSTRAINT course_themes_course_id_user_id_key UNIQUE (course_id, user_id);

-- Criar índice para user_id
CREATE INDEX IF NOT EXISTS idx_course_themes_user_id ON course_themes(user_id); 

-- Adicionar políticas RLS para course_themes agora que a coluna user_id existe
ALTER TABLE course_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own themes" ON course_themes FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage their own themes" ON course_themes FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can manage all themes" ON course_themes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND email IN ('admin@example.com', 'claude@example.com'))
); 