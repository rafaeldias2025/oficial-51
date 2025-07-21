-- =====================================================
-- MIGRAÇÃO CONSOLIDADA DO SISTEMA DE CURSOS
-- Resolve todos os conflitos de schema e duplicações
-- =====================================================

-- Limpar tabelas existentes para evitar conflitos
DROP TABLE IF EXISTS public.course_lessons CASCADE;
DROP TABLE IF EXISTS public.course_modules CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.user_course_progress CASCADE;
DROP TABLE IF EXISTS public.course_ratings CASCADE;
DROP TABLE IF EXISTS public.course_favorites CASCADE;
DROP TABLE IF EXISTS public.course_comments CASCADE;
DROP TABLE IF EXISTS public.course_hero_config CASCADE;
DROP TABLE IF EXISTS public.playlist_courses CASCADE;
DROP TABLE IF EXISTS public.course_recommendations CASCADE;
DROP TABLE IF EXISTS public.course_notifications CASCADE;
DROP TABLE IF EXISTS public.course_themes CASCADE;
DROP TABLE IF EXISTS public.course_analytics CASCADE;

-- =====================================================
-- ESQUEMA UNIFICADO E CONSISTENTE
-- =====================================================

-- Tabela principal de cursos
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    price DECIMAL(10,2) DEFAULT 0,
    image_url TEXT,
    hero_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    duration_hours INTEGER DEFAULT 0,
    difficulty_level TEXT DEFAULT 'beginner',
    instructor_name TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de módulos dos cursos
CREATE TABLE public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    estimated_duration INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de aulas dos módulos
CREATE TABLE public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    content_text TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    document_url TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de progresso do usuário
CREATE TABLE public.user_course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Tabela de avaliações dos cursos
CREATE TABLE public.course_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Tabela de favoritos
CREATE TABLE public.course_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Tabela de comentários
CREATE TABLE public.course_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.course_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configuração de hero dos cursos
CREATE TABLE public.course_hero_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_image_url TEXT,
    hero_video_url TEXT,
    cta_text TEXT DEFAULT 'Começar Agora',
    cta_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_premium ON public.courses(is_premium);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON public.course_modules(order_index);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON public.course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON public.course_lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON public.user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_course_id ON public.course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_favorites_user_id ON public.course_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_course_comments_course_id ON public.course_comments(course_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_hero_config ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS UNIFICADAS
-- =====================================================

-- Políticas para cursos
DROP POLICY IF EXISTS "Everyone can view active courses" ON public.courses;
CREATE POLICY "Everyone can view active courses" ON public.courses
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
CREATE POLICY "Admins can manage all courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para módulos
DROP POLICY IF EXISTS "Everyone can view active modules" ON public.course_modules;
CREATE POLICY "Everyone can view active modules" ON public.course_modules
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all modules" ON public.course_modules;
CREATE POLICY "Admins can manage all modules" ON public.course_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para aulas
DROP POLICY IF EXISTS "Everyone can view active lessons" ON public.course_lessons;
CREATE POLICY "Everyone can view active lessons" ON public.course_lessons
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.course_lessons;
CREATE POLICY "Admins can manage all lessons" ON public.course_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para progresso do usuário
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_course_progress;
CREATE POLICY "Users can view their own progress" ON public.user_course_progress
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_course_progress;
CREATE POLICY "Users can insert their own progress" ON public.user_course_progress
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_course_progress;
CREATE POLICY "Users can update their own progress" ON public.user_course_progress
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_course_progress;
CREATE POLICY "Admins can view all progress" ON public.user_course_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para avaliações
DROP POLICY IF EXISTS "Everyone can view ratings" ON public.course_ratings;
CREATE POLICY "Everyone can view ratings" ON public.course_ratings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own ratings" ON public.course_ratings;
CREATE POLICY "Users can manage their own ratings" ON public.course_ratings
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

-- Políticas para favoritos
DROP POLICY IF EXISTS "Everyone can view favorites" ON public.course_favorites;
CREATE POLICY "Everyone can view favorites" ON public.course_favorites
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.course_favorites;
CREATE POLICY "Users can manage their own favorites" ON public.course_favorites
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

-- Políticas para comentários
DROP POLICY IF EXISTS "Everyone can view comments" ON public.course_comments;
CREATE POLICY "Everyone can view comments" ON public.course_comments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own comments" ON public.course_comments;
CREATE POLICY "Users can insert their own comments" ON public.course_comments
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own comments" ON public.course_comments;
CREATE POLICY "Users can update their own comments" ON public.course_comments
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.course_comments;
CREATE POLICY "Users can delete their own comments" ON public.course_comments
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

-- Políticas para configuração de hero
DROP POLICY IF EXISTS "Everyone can view hero configs" ON public.course_hero_config;
CREATE POLICY "Everyone can view hero configs" ON public.course_hero_config
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage hero configs" ON public.course_hero_config;
CREATE POLICY "Admins can manage hero configs" ON public.course_hero_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON public.course_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_ratings_updated_at BEFORE UPDATE ON public.course_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_comments_updated_at BEFORE UPDATE ON public.course_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_hero_config_updated_at BEFORE UPDATE ON public.course_hero_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS DE EXEMPLO
-- =====================================================

-- Inserir cursos de exemplo
INSERT INTO public.courses (title, description, category, price, image_url, is_premium, instructor_name) VALUES
('Gestão do Tempo e Produtividade', 'Otimize sua rotina e aumente sua produtividade com métodos eficazes de gestão do tempo', 'produtividade', 197.00, '/lovable-uploads/course-fitness.jpg', true, 'Michelle Feiteira'),
('Pílulas do Bem', 'Conteúdo motivacional e transformador em doses diárias para uma vida mais equilibrada', 'pilulas', 97.00, '/lovable-uploads/course-nutrition.jpg', true, 'Michelle Feiteira'),
('Comunidade dos Sonhos', 'Conteúdo exclusivo da comunidade para realização de sonhos e metas', 'comunidade', 197.00, '/lovable-uploads/course-mindfulness.jpg', true, 'Michelle Feiteira'),
('Plataforma dos Sonhos', 'Cursos completos para transformação pessoal através de metodologias comprovadas', 'plataforma', 497.00, '/lovable-uploads/course-psychology.jpg', true, 'Michelle Feiteira'),
('Método de Emagrecimento Saudável', 'Aprenda a emagrecer de forma saudável e sustentável com acompanhamento especializado', 'saude', 397.00, '/lovable-uploads/course-wellness.jpg', true, 'Michelle Feiteira'),
('Mindfulness e Meditação', 'Técnicas de mindfulness e meditação para equilíbrio mental e emocional', 'mindfulness', 197.00, '/lovable-uploads/course-fitness.jpg', true, 'Michelle Feiteira'),
('Nutrição Funcional', 'Aprenda sobre nutrição funcional e como alimentar seu corpo de forma inteligente', 'nutricao', 297.00, '/lovable-uploads/course-nutrition.jpg', true, 'Michelle Feiteira'),
('Fitness Transformador', 'Programa completo de fitness para transformação física e mental', 'fitness', 297.00, '/lovable-uploads/course-fitness.jpg', true, 'Michelle Feiteira'),
('Psicologia Positiva', 'Desenvolva uma mentalidade positiva e transforme sua vida', 'psicologia', 197.00, '/lovable-uploads/course-psychology.jpg', true, 'Michelle Feiteira'),
('Transformação Pessoal', 'Jornada completa de autoconhecimento e transformação pessoal', 'transformacao', 397.00, '/lovable-uploads/course-wellness.jpg', true, 'Michelle Feiteira');

-- Inserir módulos para cada curso
DO $$
DECLARE
    course_record RECORD;
    module_id_1 UUID;
    module_id_2 UUID;
    module_id_3 UUID;
BEGIN
    FOR course_record IN SELECT id, title FROM public.courses WHERE is_active = true
    LOOP
        -- Módulo 1: Fundamentos
        INSERT INTO public.course_modules (id, course_id, title, description, order_index, is_active)
        VALUES (gen_random_uuid(), course_record.id, 'Módulo 1: Fundamentos', 'Conceitos básicos e introdução ao ' || course_record.title, 1, true)
        RETURNING id INTO module_id_1;
        
        -- Módulo 2: Prática
        INSERT INTO public.course_modules (id, course_id, title, description, order_index, is_active)
        VALUES (gen_random_uuid(), course_record.id, 'Módulo 2: Prática', 'Aplicação prática dos conceitos do ' || course_record.title, 2, true)
        RETURNING id INTO module_id_2;
        
        -- Módulo 3: Avançado
        INSERT INTO public.course_modules (id, course_id, title, description, order_index, is_active)
        VALUES (gen_random_uuid(), course_record.id, 'Módulo 3: Avançado', 'Técnicas avançadas e aprofundamento do ' || course_record.title, 3, true)
        RETURNING id INTO module_id_3;
        
        -- Inserir aulas para cada módulo
        -- Aulas do Módulo 1
        INSERT INTO public.course_lessons (module_id, title, description, video_url, duration_minutes, order_index, is_active) VALUES
        (module_id_1, 'Aula 1: Introdução', 'Apresentação do curso e objetivos principais', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 1, true),
        (module_id_1, 'Aula 2: Conceitos Básicos', 'Fundamentos teóricos essenciais', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 2, true),
        (module_id_1, 'Aula 3: Primeiros Passos', 'Como começar sua jornada de transformação', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 20, 3, true);
        
        -- Aulas do Módulo 2
        INSERT INTO public.course_lessons (module_id, title, description, video_url, duration_minutes, order_index, is_active) VALUES
        (module_id_2, 'Aula 4: Prática Básica', 'Exercícios práticos fundamentais', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 1, true),
        (module_id_2, 'Aula 5: Aplicação Real', 'Como aplicar no dia a dia', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 35, 2, true),
        (module_id_2, 'Aula 6: Estudos de Caso', 'Exemplos práticos e casos de sucesso', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 40, 3, true);
        
        -- Aulas do Módulo 3
        INSERT INTO public.course_lessons (module_id, title, description, video_url, duration_minutes, order_index, is_active) VALUES
        (module_id_3, 'Aula 7: Técnicas Avançadas', 'Métodos avançados para resultados superiores', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 45, 1, true),
        (module_id_3, 'Aula 8: Personalização', 'Como adaptar para suas necessidades específicas', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 50, 2, true),
        (module_id_3, 'Aula 9: Manutenção e Continuidade', 'Como manter os resultados a longo prazo', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 35, 3, true);
        
    END LOOP;
END $$;

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA COM SUCESSO
-- ===================================================== 