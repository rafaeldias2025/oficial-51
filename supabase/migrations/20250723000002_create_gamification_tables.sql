-- =====================================================
-- TABELAS DE GAMIFICAÇÃO
-- =====================================================

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('daily', 'weekly', 'monthly', 'special')),
    points INTEGER NOT NULL DEFAULT 0,
    max_progress INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de conquistas do usuário
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Tabela de badges
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de badges do usuário
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    is_earned BOOLEAN DEFAULT false,
    earned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Tabela de níveis do usuário
CREATE TABLE IF NOT EXISTS public.user_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    rewards JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de mensagens da comunidade
CREATE TABLE IF NOT EXISTS public.community_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT DEFAULT 'general',
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
-- Verificar se a coluna badge_id existe antes de criar o índice
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_badges' 
        AND column_name = 'badge_id' 
        AND table_schema = 'public'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_user_levels_user_id ON public.user_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_user_id ON public.community_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_course_id ON public.community_messages(course_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON public.community_messages(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================

-- Políticas para achievements
CREATE POLICY "Everyone can view achievements" ON public.achievements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own achievements" ON public.user_achievements
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all user achievements" ON public.user_achievements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para badges
CREATE POLICY "Everyone can view badges" ON public.badges
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage badges" ON public.badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own badges" ON public.user_badges
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own badges" ON public.user_badges
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all user badges" ON public.user_badges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para user_levels
CREATE POLICY "Users can view their own levels" ON public.user_levels
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own levels" ON public.user_levels
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own levels" ON public.user_levels
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all user levels" ON public.user_levels
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Políticas para community_messages
CREATE POLICY "Everyone can view community messages" ON public.community_messages
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own messages" ON public.community_messages
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own messages" ON public.community_messages
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own messages" ON public.community_messages
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all messages" ON public.community_messages
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

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON public.user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_badges_updated_at BEFORE UPDATE ON public.user_badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_levels_updated_at BEFORE UPDATE ON public.user_levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_messages_updated_at BEFORE UPDATE ON public.community_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir conquistas padrão
INSERT INTO public.achievements (title, description, icon, category, points, max_progress) VALUES
('Primeira Missão', 'Complete sua primeira missão do dia', '🎯', 'daily', 50, 1),
('Semana Perfeita', 'Complete missões por 7 dias consecutivos', '🔥', 'weekly', 200, 7),
('Campeão da Água', 'Beba 2L de água por 5 dias seguidos', '💧', 'weekly', 150, 5),
('Mestre do Fitness', 'Complete 30 atividades físicas', '💪', 'monthly', 500, 30),
('Guru da Mindfulness', 'Pratique mindfulness por 21 dias', '🧘', 'monthly', 300, 21),
('Líder da Comunidade', 'Ajude 10 outros usuários', '👥', 'special', 1000, 10);

-- Inserir badges padrão
INSERT INTO public.badges (name, description, icon, rarity) VALUES
('Novato', 'Primeiro login na plataforma', '🌟', 'common'),
('Dedicado', '7 dias consecutivos de atividade', '🔥', 'rare'),
('Guerreiro', '30 dias consecutivos de atividade', '⚔️', 'epic'),
('Lenda', '100 dias consecutivos de atividade', '👑', 'legendary'),
('Entusiasta do Fitness', 'Complete 50 atividades físicas', '💪', 'rare'),
('Mestre da Mindfulness', 'Pratique mindfulness por 100 dias', '🧘', 'epic'); 