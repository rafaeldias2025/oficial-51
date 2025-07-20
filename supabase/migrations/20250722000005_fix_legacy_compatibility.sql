-- Migração para corrigir problemas de compatibilidade
-- Adicionar tabelas e colunas faltantes identificadas no build

-- Adicionar coluna created_by à tabela courses se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'created_by') THEN
    ALTER TABLE public.courses ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Adicionar coluna user_id à tabela profiles se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
    ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Criar tabelas faltantes identificadas no build

-- Tabela daily_missions
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID,
    mission_date DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela diary_entries
CREATE TABLE IF NOT EXISTS public.diary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE DEFAULT CURRENT_DATE,
    content TEXT,
    mood INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela historico_medidas
CREATE TABLE IF NOT EXISTS public.historico_medidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data_medicao DATE DEFAULT CURRENT_DATE,
    peso_kg DECIMAL(5,2),
    circunferencia_abdominal_cm DECIMAL(5,2),
    circunferencia_braco_cm DECIMAL(5,2),
    circunferencia_perna_cm DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela weight_goals
CREATE TABLE IF NOT EXISTS public.weight_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meta_peso_kg DECIMAL(5,2),
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    status TEXT DEFAULT 'em_andamento',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela missoes_usuario
CREATE TABLE IF NOT EXISTS public.missoes_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data DATE DEFAULT CURRENT_DATE,
    autocuidado BOOLEAN DEFAULT FALSE,
    bebeu_agua BOOLEAN DEFAULT FALSE,
    dormiu_bem BOOLEAN DEFAULT FALSE,
    humor TEXT,
    observacoes TEXT,
    pontos_conquistados INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela user_challenges
CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID,
    progress INTEGER DEFAULT 0,
    target_value INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas faltantes à tabela pontuacao_diaria
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pontuacao_diaria' AND column_name = 'pontos_fome_emocional') THEN
    ALTER TABLE public.pontuacao_diaria ADD COLUMN pontos_fome_emocional INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pontuacao_diaria' AND column_name = 'total_pontos_dia') THEN
    ALTER TABLE public.pontuacao_diaria ADD COLUMN total_pontos_dia INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adicionar colunas faltantes à tabela missao_dia
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'missao_dia' AND column_name = 'inspira') THEN
    ALTER TABLE public.missao_dia ADD COLUMN inspira TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'missao_dia' AND column_name = 'humor') THEN
    ALTER TABLE public.missao_dia ADD COLUMN humor TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'missao_dia' AND column_name = 'prioridades') THEN
    ALTER TABLE public.missao_dia ADD COLUMN prioridades TEXT[];
  END IF;
END $$;

-- Adicionar coluna peso_atual_kg à tabela dados_saude_usuario
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dados_saude_usuario' AND column_name = 'peso_atual_kg') THEN
    ALTER TABLE public.dados_saude_usuario ADD COLUMN peso_atual_kg DECIMAL(5,2);
  END IF;
END $$;

-- Adicionar coluna data_medicao à tabela pesagens
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pesagens' AND column_name = 'data_medicao') THEN
    ALTER TABLE public.pesagens ADD COLUMN data_medicao DATE DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Adicionar colunas faltantes à tabela dados_fisicos_usuario
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dados_fisicos_usuario' AND column_name = 'nome_completo') THEN
    ALTER TABLE public.dados_fisicos_usuario ADD COLUMN nome_completo TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dados_fisicos_usuario' AND column_name = 'data_nascimento') THEN
    ALTER TABLE public.dados_fisicos_usuario ADD COLUMN data_nascimento DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dados_fisicos_usuario' AND column_name = 'peso_atual_kg') THEN
    ALTER TABLE public.dados_fisicos_usuario ADD COLUMN peso_atual_kg DECIMAL(5,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dados_fisicos_usuario' AND column_name = 'circunferencia_abdominal_cm') THEN
    ALTER TABLE public.dados_fisicos_usuario ADD COLUMN circunferencia_abdominal_cm DECIMAL(5,2);
  END IF;
END $$;

-- Adicionar coluna progresso_percentual à tabela dados_saude_usuario
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dados_saude_usuario' AND column_name = 'progresso_percentual') THEN
    ALTER TABLE public.dados_saude_usuario ADD COLUMN progresso_percentual INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adicionar coluna pontos_avaliacao_dia à tabela pontuacao_diaria
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pontuacao_diaria' AND column_name = 'pontos_avaliacao_dia') THEN
    ALTER TABLE public.pontuacao_diaria ADD COLUMN pontos_avaliacao_dia INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adicionar colunas faltantes à tabela missao_dia
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'missao_dia' AND column_name = 'titulo') THEN
    ALTER TABLE public.missao_dia ADD COLUMN titulo TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'missao_dia' AND column_name = 'liquido_ao_acordar') THEN
    ALTER TABLE public.missao_dia ADD COLUMN liquido_ao_acordar BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Adicionar coluna expires_at à tabela user_google_credentials
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_google_credentials' AND column_name = 'expires_at') THEN
    ALTER TABLE public.user_google_credentials ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Adicionar id UUID PRIMARY KEY à tabela profiles se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
    ALTER TABLE public.profiles ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Criar tabelas de desafios e progresso
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    challenge_type TEXT,
    points INTEGER DEFAULT 0,
    duration_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID,
    lesson_id TEXT,
    progress_percentage INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_medidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missoes_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para as novas tabelas
CREATE POLICY "Users can view own daily missions" ON public.daily_missions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily missions" ON public.daily_missions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily missions" ON public.daily_missions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own diary entries" ON public.diary_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary entries" ON public.diary_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries" ON public.diary_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own historico medidas" ON public.historico_medidas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own historico medidas" ON public.historico_medidas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own historico medidas" ON public.historico_medidas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weight goals" ON public.weight_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight goals" ON public.weight_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight goals" ON public.weight_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own missoes usuario" ON public.missoes_usuario
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missoes usuario" ON public.missoes_usuario
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missoes usuario" ON public.missoes_usuario
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own user challenges" ON public.user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user challenges" ON public.user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user challenges" ON public.user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view challenges" ON public.challenges
    FOR SELECT USING (true);

CREATE POLICY "Users can view own user progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Índices para as novas tabelas
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_id ON public.daily_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_missions_date ON public.daily_missions(mission_date);

CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON public.diary_entries(entry_date);

CREATE INDEX IF NOT EXISTS idx_historico_medidas_user_id ON public.historico_medidas(user_id);
CREATE INDEX IF NOT EXISTS idx_historico_medidas_data ON public.historico_medidas(data_medicao);

CREATE INDEX IF NOT EXISTS idx_weight_goals_user_id ON public.weight_goals(user_id);

CREATE INDEX IF NOT EXISTS idx_missoes_usuario_user_id ON public.missoes_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_missoes_usuario_data ON public.missoes_usuario(data);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON public.user_challenges(challenge_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON public.user_progress(course_id);

-- Triggers para updated_at nas novas tabelas
CREATE TRIGGER update_daily_missions_updated_at BEFORE UPDATE ON public.daily_missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON public.diary_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_historico_medidas_updated_at BEFORE UPDATE ON public.historico_medidas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weight_goals_updated_at BEFORE UPDATE ON public.weight_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missoes_usuario_updated_at BEFORE UPDATE ON public.missoes_usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_challenges_updated_at BEFORE UPDATE ON public.user_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Recriar funções RPC que podem estar faltando
CREATE OR REPLACE FUNCTION update_user_points(points_to_add INTEGER, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_points 
    SET pontos_totais = pontos_totais + points_to_add,
        updated_at = NOW()
    WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        INSERT INTO public.user_points (user_id, pontos_totais)
        VALUES (user_uuid, points_to_add);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_physical_data_complete(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.dados_fisicos_usuario 
        WHERE user_id = user_uuid
    ) INTO has_data;
    
    RETURN has_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_complete_user_registration(user_email TEXT, user_name TEXT, user_password TEXT)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Criar usuário no auth.users
    INSERT INTO auth.users (email, encrypted_password)
    VALUES (user_email, crypt(user_password, gen_salt('bf')))
    RETURNING id INTO new_user_id;
    
    -- Criar perfil
    INSERT INTO public.profiles (user_id, full_name, email, role)
    VALUES (new_user_id, user_name, user_email, 'client');
    
    -- Criar registro de pontos
    INSERT INTO public.user_points (user_id, pontos_totais)
    VALUES (new_user_id, 0);
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION execute_user_health_check(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'has_physical_data', EXISTS(SELECT 1 FROM public.dados_fisicos_usuario WHERE user_id = user_uuid),
        'has_health_data', EXISTS(SELECT 1 FROM public.dados_saude_usuario WHERE user_id = user_uuid),
        'has_weight_data', EXISTS(SELECT 1 FROM public.pesagens WHERE user_id = user_uuid),
        'last_weight_date', (SELECT MAX(data_pesagem) FROM public.pesagens WHERE user_id = user_uuid)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION run_data_integrity_monitor()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM auth.users),
        'total_profiles', (SELECT COUNT(*) FROM public.profiles),
        'total_physical_data', (SELECT COUNT(*) FROM public.dados_fisicos_usuario),
        'total_weight_data', (SELECT COUNT(*) FROM public.pesagens),
        'last_check', NOW()
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo para challenges
INSERT INTO public.challenges (title, description, challenge_type, points, duration_days) VALUES
('Desafio da Hidratação', 'Beba 2L de água por dia durante uma semana', 'hidratacao', 50, 7),
('Desafio do Exercício', 'Faça 30 minutos de exercício por dia', 'exercicio', 100, 7),
('Desafio da Alimentação', 'Mantenha uma alimentação saudável por 5 dias', 'alimentacao', 75, 5)
ON CONFLICT DO NOTHING; 