-- Correção do Sistema de Sessões e Ferramentas
-- Criado em: 19/01/2025

-- Tabela de perguntas das ferramentas (corrigida para usar integer)
CREATE TABLE IF NOT EXISTS tool_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id INTEGER REFERENCES coaching_tools(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('scale', 'multiple_choice', 'text', 'yes_no')),
  category VARCHAR(100),
  question_order INTEGER NOT NULL,
  options JSONB, -- para múltipla escolha
  scale_range JSONB, -- {min, max, step}
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos de sessões (corrigida para usar integer)
CREATE TABLE IF NOT EXISTS session_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_id INTEGER REFERENCES coaching_tools(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'in_progress', 'completed', 'cancelled')),
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas que faltam na tabela session_results
ALTER TABLE session_results 
ADD COLUMN IF NOT EXISTS overall_score DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS category_scores JSONB,
ADD COLUMN IF NOT EXISTS insights JSONB,
ADD COLUMN IF NOT EXISTS recommendations JSONB,
ADD COLUMN IF NOT EXISTS radar_data JSONB,
ADD COLUMN IF NOT EXISTS bar_chart_data JSONB,
ADD COLUMN IF NOT EXISTS gauge_value DECIMAL(4,2);

-- Índices para tool_questions
CREATE INDEX IF NOT EXISTS idx_tool_questions_tool_id ON tool_questions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_questions_category ON tool_questions(category);
CREATE INDEX IF NOT EXISTS idx_tool_questions_order ON tool_questions(question_order);

-- Índices para session_schedules
CREATE INDEX IF NOT EXISTS idx_session_schedules_user_id ON session_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_session_schedules_scheduled_date ON session_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_session_schedules_status ON session_schedules(status);

-- Índices para session_results
CREATE INDEX IF NOT EXISTS idx_session_results_overall_score ON session_results(overall_score);

-- Políticas RLS para tool_questions
ALTER TABLE tool_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tool questions" ON tool_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Políticas RLS para session_schedules
ALTER TABLE session_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own session schedules" ON session_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage session schedules" ON session_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Triggers para atualizar updated_at
CREATE TRIGGER update_tool_questions_updated_at 
  BEFORE UPDATE ON tool_questions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_schedules_updated_at 
  BEFORE UPDATE ON session_schedules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE tool_questions IS 'Perguntas das ferramentas de coaching';
COMMENT ON TABLE session_schedules IS 'Agendamentos de sessões para usuários';

COMMENT ON COLUMN tool_questions.question_type IS 'Tipo da pergunta: scale, multiple_choice, text, yes_no';
COMMENT ON COLUMN tool_questions.options IS 'Opções para perguntas de múltipla escolha';
COMMENT ON COLUMN tool_questions.scale_range IS 'Configuração da escala: {min, max, step}';
COMMENT ON COLUMN session_schedules.status IS 'Status: pending, available, in_progress, completed, cancelled';
COMMENT ON COLUMN session_results.overall_score IS 'Pontuação geral da sessão (0-100)';
COMMENT ON COLUMN session_results.category_scores IS 'Pontuações por categoria em formato JSON';
COMMENT ON COLUMN session_results.insights IS 'Insights gerados em formato JSON';
COMMENT ON COLUMN session_results.recommendations IS 'Recomendações em formato JSON';
COMMENT ON COLUMN session_results.radar_data IS 'Dados para gráfico radar em formato JSON';
COMMENT ON COLUMN session_results.bar_chart_data IS 'Dados para gráfico de barras em formato JSON';
COMMENT ON COLUMN session_results.gauge_value IS 'Valor para gráfico gauge (0-100)'; 