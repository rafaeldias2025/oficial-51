-- =====================================================
-- CORREÇÃO DA TABELA PONTUAÇÃO DIÁRIA
-- =====================================================

-- Remover tabela existente se houver
DROP TABLE IF EXISTS public.pontuacao_diaria CASCADE;

-- Criar tabela com estrutura correta
CREATE TABLE public.pontuacao_diaria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    pontos_liquido_manha INTEGER DEFAULT 0,
    pontos_conexao_interna INTEGER DEFAULT 0,
    pontos_energia_acordar INTEGER DEFAULT 0,
    pontos_sono INTEGER DEFAULT 0,
    pontos_agua INTEGER DEFAULT 0,
    pontos_atividade_fisica INTEGER DEFAULT 0,
    pontos_estresse INTEGER DEFAULT 0,
    pontos_fome_emocional INTEGER DEFAULT 0,
    pontos_gratidao INTEGER DEFAULT 0,
    pontos_pequena_vitoria INTEGER DEFAULT 0,
    pontos_intencao_amanha INTEGER DEFAULT 0,
    pontos_avaliacao_dia INTEGER DEFAULT 0,
    total_pontos_dia INTEGER DEFAULT 0,
    categoria_dia TEXT DEFAULT 'baixa' CHECK (categoria_dia IN ('baixa', 'medio', 'excelente')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, data)
);

-- Habilitar RLS
ALTER TABLE public.pontuacao_diaria ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own pontuacao" ON public.pontuacao_diaria
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own pontuacao" ON public.pontuacao_diaria
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own pontuacao" ON public.pontuacao_diaria
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all pontuacao" ON public.pontuacao_diaria
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email IN ('admin@instituto.com', 'rafael@instituto.com')
        )
    );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_user_id ON public.pontuacao_diaria(user_id);
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_data ON public.pontuacao_diaria(data);
CREATE INDEX IF NOT EXISTS idx_pontuacao_diaria_categoria ON public.pontuacao_diaria(categoria_dia);

-- Trigger para updated_at
CREATE TRIGGER update_pontuacao_diaria_updated_at BEFORE UPDATE ON public.pontuacao_diaria
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 