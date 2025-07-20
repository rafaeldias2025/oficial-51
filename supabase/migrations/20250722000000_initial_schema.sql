-- Migração inicial para criar tabelas básicas
-- Autor: Claude AI
-- Data: 2025-07-22

-- Inserir usuários admin na tabela auth.users (apenas para ambiente local de testes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
        VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@example.com', '', NOW(), NOW(), '{}', '{}', false, NOW(), NOW());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000002') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
        VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'claude@example.com', '', NOW(), NOW(), '{}', '{}', false, NOW(), NOW());
    END IF;
END $$;

-- ✅ CRIAR TABELA PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR TABELA COURSES
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    duration INTEGER DEFAULT 0,
    difficulty TEXT DEFAULT 'beginner',
    category TEXT DEFAULT 'general',
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ TABELAS MODULES E LESSONS JÁ EXISTEM COMO course_modules E course_lessons

-- ✅ CRIAR TABELA USER_COURSE_PROGRESS
CREATE TABLE IF NOT EXISTS user_course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- ✅ CRIAR TABELA USER_LESSON_PROGRESS
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES course_lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    watched_duration INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lesson_id)
);

-- ✅ CRIAR TABELA COURSE_RATINGS
CREATE TABLE IF NOT EXISTS course_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ✅ CRIAR TABELA COURSE_FAVORITES
CREATE TABLE IF NOT EXISTS course_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ✅ CRIAR TABELA COURSE_COMMENTS
CREATE TABLE IF NOT EXISTS course_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR TABELA USER_BADGES
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    badge_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR TABELA USER_CERTIFICATES
CREATE TABLE IF NOT EXISTS user_certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    certificate_url TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ✅ CRIAR TABELA USER_PLAYLISTS
CREATE TABLE IF NOT EXISTS user_playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR TABELA PLAYLIST_COURSES
CREATE TABLE IF NOT EXISTS playlist_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID REFERENCES user_playlists(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(playlist_id, course_id)
);

-- ✅ CRIAR TABELA COURSE_RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS course_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    reason TEXT,
    score DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR TABELA COURSE_NOTIFICATIONS
CREATE TABLE IF NOT EXISTS course_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ CRIAR TABELA COURSE_THEMES
CREATE TABLE IF NOT EXISTS course_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    theme_name TEXT NOT NULL,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#1F2937',
    background_color TEXT DEFAULT '#FFFFFF',
    text_color TEXT DEFAULT '#1F2937',
    is_dark_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ CRIAR TABELA COURSE_ANALYTICS
CREATE TABLE IF NOT EXISTS course_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ CRIAR TABELA COURSE_HERO_CONFIG
CREATE TABLE IF NOT EXISTS course_hero_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    hero_type TEXT DEFAULT 'image', -- 'image' or 'video'
    hero_image_url TEXT,
    hero_video_url TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ CRIAR TABELA MODULE_DISPLAY_CONFIG
CREATE TABLE IF NOT EXISTS module_display_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    display_mode TEXT DEFAULT 'course_based', -- 'direct' or 'course_based'
    show_module_activation BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ CRIAR TABELA SOCIAL_FEATURES_CONFIG
CREATE TABLE IF NOT EXISTS social_features_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enable_comments BOOLEAN DEFAULT true,
    enable_ratings BOOLEAN DEFAULT true,
    enable_favorites BOOLEAN DEFAULT true,
    enable_recommendations BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ CRIAR TABELA ADDITIONAL_FEATURES_CONFIG
CREATE TABLE IF NOT EXISTS additional_features_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enable_visual_progress BOOLEAN DEFAULT true,
    enable_certificates BOOLEAN DEFAULT true,
    enable_badges BOOLEAN DEFAULT true,
    enable_playlists BOOLEAN DEFAULT true,
    enable_dark_mode BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ CRIAR TABELA ADMIN_ANALYTICS_CONFIG
CREATE TABLE IF NOT EXISTS admin_analytics_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enable_analytics BOOLEAN DEFAULT true,
    enable_export BOOLEAN DEFAULT true,
    enable_reports BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ✅ INSERIR DADOS INICIAIS
INSERT INTO profiles (id, email, full_name) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User'),
('00000000-0000-0000-0000-000000000002', 'claude@example.com', 'Claude AI')
ON CONFLICT (id) DO NOTHING;

-- Removido bloco de inserção de cursos de exemplo, será movido para a migração de is_premium

-- Removido inserts de configurações iniciais de cursos, serão movidos para a migração de is_premium

-- Removido bloco restante de inserção em course_hero_config, já movido para a migração de is_premium

-- Removido todos os blocos de inserção de configurações de cursos, já estão na migração de is_premium 