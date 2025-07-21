-- Migração para criar tabelas de saúde e pesagens
-- Incluindo integração com balança automática

-- Tabela para dados físicos do usuário
CREATE TABLE IF NOT EXISTS public.dados_fisicos_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    altura_cm DECIMAL(5,2),
    peso_atual_kg DECIMAL(5,2),
    circunferencia_abdominal_cm DECIMAL(5,2),
    imc DECIMAL(4,2),
    categoria_imc TEXT,
    risco_cardiometabolico TEXT,
    data_medicao DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para pesagens semanais (integração com balança automática)
CREATE TABLE IF NOT EXISTS public.pesagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    peso_kg DECIMAL(5,2) NOT NULL,
    data_pesagem DATE DEFAULT CURRENT_DATE,
  hora_pesagem TIME DEFAULT CURRENT_TIME,
    fonte_dados TEXT DEFAULT 'balanca_automatica', -- 'balanca_automatica', 'manual'
    dispositivo_id TEXT, -- ID do dispositivo da balança
    sincronizado_com_google_fit BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para dados de saúde do usuário
CREATE TABLE IF NOT EXISTS public.dados_saude_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pressao_sistolica INTEGER,
  pressao_diastolica INTEGER,
  frequencia_cardiaca INTEGER,
    glicemia_mg_dl DECIMAL(4,1),
    colesterol_total INTEGER,
    hdl INTEGER,
    ldl INTEGER,
    triglicerideos INTEGER,
    data_medicao DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para pontuação diária
CREATE TABLE IF NOT EXISTS public.pontuacao_diaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data_pontuacao DATE DEFAULT CURRENT_DATE,
    pontos_exercicio INTEGER DEFAULT 0,
    pontos_alimentacao INTEGER DEFAULT 0,
    pontos_hidratacao INTEGER DEFAULT 0,
  pontos_sono INTEGER DEFAULT 0,
  pontos_estresse INTEGER DEFAULT 0,
    pontos_gerais INTEGER DEFAULT 0,
    total_pontos_dia INTEGER DEFAULT 0,
    meta_diaria INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para missões diárias
CREATE TABLE IF NOT EXISTS public.missao_dia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data_missao DATE DEFAULT CURRENT_DATE,
    titulo TEXT,
  descricao TEXT,
    tipo_missao TEXT, -- 'exercicio', 'alimentacao', 'hidratacao', 'sono', 'estresse'
  pontos_recompensa INTEGER DEFAULT 10,
    concluida BOOLEAN DEFAULT FALSE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para pontos do usuário
CREATE TABLE IF NOT EXISTS public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pontos_totais INTEGER DEFAULT 0,
    nivel_atual INTEGER DEFAULT 1,
    pontos_para_proximo_nivel INTEGER DEFAULT 100,
    historico_pontos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para avaliações semanais
CREATE TABLE IF NOT EXISTS public.weekly_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    semana_inicio DATE,
    semana_fim DATE,
    peso_inicial DECIMAL(5,2),
    peso_final DECIMAL(5,2),
    variacao_peso DECIMAL(5,2),
    meta_semanal DECIMAL(5,2),
    atingiu_meta BOOLEAN DEFAULT FALSE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para credenciais do Google Fit
CREATE TABLE IF NOT EXISTS public.user_google_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token TEXT,
  refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    token_type TEXT,
    scope TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para dados do Google Fit
CREATE TABLE IF NOT EXISTS public.google_fit_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data_medicao DATE,
    tipo_dado TEXT, -- 'steps', 'calories', 'heart_rate', 'weight', 'sleep'
    valor DECIMAL(10,2),
    unidade TEXT,
    fonte_dados TEXT DEFAULT 'google_fit',
    sincronizado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para metas
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo_meta TEXT, -- 'peso', 'exercicio', 'alimentacao', 'hidratacao'
    valor_meta DECIMAL(10,2),
    valor_atual DECIMAL(10,2) DEFAULT 0,
    unidade TEXT,
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    status TEXT DEFAULT 'em_andamento', -- 'em_andamento', 'concluida', 'cancelada'
    prioridade TEXT DEFAULT 'media', -- 'baixa', 'media', 'alta'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para sessões de treino
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo_sessao TEXT, -- 'cardio', 'forca', 'flexibilidade', 'equilibrio'
    duracao_minutos INTEGER,
    intensidade TEXT, -- 'baixa', 'media', 'alta'
    calorias_estimadas INTEGER,
    data_sessao DATE DEFAULT CURRENT_DATE,
    hora_inicio TIME,
    hora_fim TIME,
    concluida BOOLEAN DEFAULT FALSE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.dados_fisicos_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dados_saude_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontuacao_diaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missao_dia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_google_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_fit_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para dados físicos
CREATE POLICY "Users can view own physical data" ON public.dados_fisicos_usuario
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own physical data" ON public.dados_fisicos_usuario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own physical data" ON public.dados_fisicos_usuario
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para pesagens
CREATE POLICY "Users can view own weigh-ins" ON public.pesagens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weigh-ins" ON public.pesagens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weigh-ins" ON public.pesagens
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para dados de saúde
CREATE POLICY "Users can view own health data" ON public.dados_saude_usuario
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health data" ON public.dados_saude_usuario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health data" ON public.dados_saude_usuario
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para pontuação diária
CREATE POLICY "Users can view own daily points" ON public.pontuacao_diaria
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily points" ON public.pontuacao_diaria
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily points" ON public.pontuacao_diaria
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para missões diárias
CREATE POLICY "Users can view own daily missions" ON public.missao_dia
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily missions" ON public.missao_dia
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily missions" ON public.missao_dia
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para pontos do usuário
CREATE POLICY "Users can view own points" ON public.user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" ON public.user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON public.user_points
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para avaliações semanais
CREATE POLICY "Users can view own weekly evaluations" ON public.weekly_evaluations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly evaluations" ON public.weekly_evaluations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly evaluations" ON public.weekly_evaluations
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para credenciais Google
CREATE POLICY "Users can view own Google credentials" ON public.user_google_credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google credentials" ON public.user_google_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google credentials" ON public.user_google_credentials
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para dados Google Fit
CREATE POLICY "Users can view own Google Fit data" ON public.google_fit_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google Fit data" ON public.google_fit_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google Fit data" ON public.google_fit_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para metas
CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para sessões
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_dados_fisicos_user_id ON public.dados_fisicos_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_dados_fisicos_data_medicao ON public.dados_fisicos_usuario(data_medicao);

CREATE INDEX IF NOT EXISTS idx_pesagens_user_id ON public.pesagens(user_id);
CREATE INDEX IF NOT EXISTS idx_pesagens_data_pesagem ON public.pesagens(data_pesagem);
CREATE INDEX IF NOT EXISTS idx_pesagens_fonte_dados ON public.pesagens(fonte_dados);

CREATE INDEX IF NOT EXISTS idx_dados_saude_user_id ON public.dados_saude_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_dados_saude_data_medicao ON public.dados_saude_usuario(data_medicao);

CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_user_id ON public.pontuacao_diaria(user_id);
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_data ON public.pontuacao_diaria(data_pontuacao);

CREATE INDEX IF NOT EXISTS idx_missao_dia_user_id ON public.missao_dia(user_id);
CREATE INDEX IF NOT EXISTS idx_missao_dia_data ON public.missao_dia(data_missao);

CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_evaluations_user_id ON public.weekly_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_evaluations_semana ON public.weekly_evaluations(semana_inicio, semana_fim);

CREATE INDEX IF NOT EXISTS idx_google_credentials_user_id ON public.user_google_credentials(user_id);

CREATE INDEX IF NOT EXISTS idx_google_fit_data_user_id ON public.google_fit_data(user_id);
CREATE INDEX IF NOT EXISTS idx_google_fit_data_tipo ON public.google_fit_data(tipo_dado);
CREATE INDEX IF NOT EXISTS idx_google_fit_data_data ON public.google_fit_data(data_medicao);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_data ON public.sessions(data_sessao);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_dados_fisicos_updated_at BEFORE UPDATE ON public.dados_fisicos_usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pesagens_updated_at BEFORE UPDATE ON public.pesagens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dados_saude_updated_at BEFORE UPDATE ON public.dados_saude_usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pontuacao_diaria_updated_at BEFORE UPDATE ON public.pontuacao_diaria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missao_dia_updated_at BEFORE UPDATE ON public.missao_dia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON public.user_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_evaluations_updated_at BEFORE UPDATE ON public.weekly_evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_google_credentials_updated_at BEFORE UPDATE ON public.user_google_credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_google_fit_data_updated_at BEFORE UPDATE ON public.google_fit_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular IMC
CREATE OR REPLACE FUNCTION calcular_imc(peso_kg DECIMAL, altura_cm DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF altura_cm <= 0 THEN
        RETURN NULL;
    END IF;
    
    RETURN peso_kg / POWER(altura_cm / 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Função para categorizar IMC
CREATE OR REPLACE FUNCTION calcular_categoria_imc(imc DECIMAL)
RETURNS TEXT AS $$
BEGIN
    IF imc IS NULL THEN
        RETURN NULL;
    ELSIF imc < 18.5 THEN
        RETURN 'Abaixo do peso';
    ELSIF imc < 25 THEN
        RETURN 'Peso normal';
    ELSIF imc < 30 THEN
        RETURN 'Sobrepeso';
    ELSIF imc < 35 THEN
        RETURN 'Obesidade grau I';
    ELSIF imc < 40 THEN
        RETURN 'Obesidade grau II';
    ELSE
        RETURN 'Obesidade grau III';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular risco cardiometabólico
CREATE OR REPLACE FUNCTION calcular_risco_cardiometabolico(imc DECIMAL, circunferencia_abdominal DECIMAL, genero TEXT)
RETURNS TEXT AS $$
BEGIN
    IF imc IS NULL OR circunferencia_abdominal IS NULL THEN
        RETURN 'Dados insuficientes';
    END IF;
    
    -- Critérios baseados em IMC e circunferência abdominal
    IF imc >= 30 OR 
       (genero = 'M' AND circunferencia_abdominal > 102) OR
       (genero = 'F' AND circunferencia_abdominal > 88) THEN
        RETURN 'Alto risco';
    ELSIF imc >= 25 OR
          (genero = 'M' AND circunferencia_abdominal > 94) OR
          (genero = 'F' AND circunferencia_abdominal > 80) THEN
        RETURN 'Risco moderado';
    ELSE
        RETURN 'Baixo risco';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para inserir pesagem automática da balança
CREATE OR REPLACE FUNCTION inserir_pesagem_automatica(
    p_user_id UUID,
    p_peso_kg DECIMAL,
    p_dispositivo_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_pesagem_id UUID;
BEGIN
    INSERT INTO public.pesagens (
        user_id,
        peso_kg,
        fonte_dados,
        dispositivo_id,
        data_pesagem,
        hora_pesagem
    ) VALUES (
        p_user_id,
        p_peso_kg,
        'balanca_automatica',
        p_dispositivo_id,
        CURRENT_DATE,
        CURRENT_TIME
    ) RETURNING id INTO v_pesagem_id;
    
    -- Atualizar dados físicos do usuário com o novo peso
    UPDATE public.dados_fisicos_usuario 
    SET peso_atual_kg = p_peso_kg,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Se não existir registro de dados físicos, criar um
    IF NOT FOUND THEN
        INSERT INTO public.dados_fisicos_usuario (
            user_id,
            peso_atual_kg,
            data_medicao
        ) VALUES (
            p_user_id,
            p_peso_kg,
            CURRENT_DATE
        );
    END IF;
    
    RETURN v_pesagem_id;
END;
$$ LANGUAGE plpgsql;

-- Função para sincronizar com Google Fit
CREATE OR REPLACE FUNCTION sincronizar_com_google_fit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_credentials RECORD;
    v_pesagem RECORD;
BEGIN
    -- Verificar se o usuário tem credenciais do Google
    SELECT * INTO v_credentials 
    FROM public.user_google_credentials 
    WHERE user_id = p_user_id 
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Buscar pesagens não sincronizadas
    FOR v_pesagem IN 
        SELECT * FROM public.pesagens 
        WHERE user_id = p_user_id 
        AND NOT sincronizado_com_google_fit
        ORDER BY data_pesagem DESC
    LOOP
        -- Aqui seria implementada a lógica de sincronização com Google Fit API
        -- Por enquanto, apenas marca como sincronizada
        UPDATE public.pesagens 
        SET sincronizado_com_google_fit = TRUE
        WHERE id = v_pesagem.id;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql; 