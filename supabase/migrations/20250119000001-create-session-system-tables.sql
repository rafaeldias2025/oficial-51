-- Sistema de Sessões e Ferramentas
-- Criado em: 19/01/2025

-- Tabela de ferramentas de coaching
CREATE TABLE IF NOT EXISTS coaching_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  estimated_time INTEGER DEFAULT 30, -- em minutos
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perguntas das ferramentas
CREATE TABLE IF NOT EXISTS tool_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES coaching_tools(id) ON DELETE CASCADE,
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

-- Tabela de sessões de coaching (já existe, vamos atualizar)
ALTER TABLE coaching_sessions 
ADD COLUMN IF NOT EXISTS tool_id UUID REFERENCES coaching_tools(id),
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Tabela de respostas das sessões (já existe, vamos atualizar)
ALTER TABLE session_responses 
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS response_text TEXT;

-- Tabela de resultados das sessões
CREATE TABLE IF NOT EXISTS session_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  overall_score DECIMAL(4,2),
  category_scores JSONB,
  insights JSONB,
  recommendations JSONB,
  radar_data JSONB,
  bar_chart_data JSONB,
  gauge_value DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de insights das sessões
CREATE TABLE IF NOT EXISTS session_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('strength', 'weakness', 'trend', 'pattern')),
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  impact VARCHAR(20) CHECK (impact IN ('high', 'medium', 'low')),
  actionable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos de sessões
CREATE TABLE IF NOT EXISTS session_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_id UUID REFERENCES coaching_tools(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'in_progress', 'completed', 'cancelled')),
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_coaching_tools_category ON coaching_tools(category);
CREATE INDEX IF NOT EXISTS idx_coaching_tools_active ON coaching_tools(is_active);

CREATE INDEX IF NOT EXISTS idx_tool_questions_tool_id ON tool_questions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_questions_category ON tool_questions(category);
CREATE INDEX IF NOT EXISTS idx_tool_questions_order ON tool_questions(question_order);

CREATE INDEX IF NOT EXISTS idx_coaching_sessions_tool_id ON coaching_sessions(tool_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_scheduled_date ON coaching_sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_status ON coaching_sessions(status);

CREATE INDEX IF NOT EXISTS idx_session_responses_category ON session_responses(category);

CREATE INDEX IF NOT EXISTS idx_session_results_session_id ON session_results(session_id);
CREATE INDEX IF NOT EXISTS idx_session_results_overall_score ON session_results(overall_score);

CREATE INDEX IF NOT EXISTS idx_session_insights_session_id ON session_insights(session_id);
CREATE INDEX IF NOT EXISTS idx_session_insights_type ON session_insights(insight_type);

CREATE INDEX IF NOT EXISTS idx_session_schedules_user_id ON session_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_session_schedules_scheduled_date ON session_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_session_schedules_status ON session_schedules(status);

-- Políticas RLS (Row Level Security)
ALTER TABLE coaching_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas para coaching_tools (apenas admins podem gerenciar)
CREATE POLICY "Admins can manage coaching tools" ON coaching_tools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Políticas para tool_questions (apenas admins podem gerenciar)
CREATE POLICY "Admins can manage tool questions" ON tool_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Políticas para session_results
CREATE POLICY "Users can view their own session results" ON session_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coaching_sessions 
      WHERE coaching_sessions.id = session_results.session_id 
      AND coaching_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all session results" ON session_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Políticas para session_insights
CREATE POLICY "Users can view their own session insights" ON session_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coaching_sessions 
      WHERE coaching_sessions.id = session_insights.session_id 
      AND coaching_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all session insights" ON session_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Políticas para session_schedules
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
CREATE TRIGGER update_coaching_tools_updated_at 
  BEFORE UPDATE ON coaching_tools 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_questions_updated_at 
  BEFORE UPDATE ON tool_questions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_results_updated_at 
  BEFORE UPDATE ON session_results 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_schedules_updated_at 
  BEFORE UPDATE ON session_schedules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE coaching_tools IS 'Ferramentas de coaching disponíveis no sistema';
COMMENT ON TABLE tool_questions IS 'Perguntas das ferramentas de coaching';
COMMENT ON TABLE session_results IS 'Resultados e análises das sessões';
COMMENT ON TABLE session_insights IS 'Insights gerados a partir das sessões';
COMMENT ON TABLE session_schedules IS 'Agendamentos de sessões para usuários';

COMMENT ON COLUMN coaching_tools.estimated_time IS 'Tempo estimado em minutos para completar a ferramenta';
COMMENT ON COLUMN tool_questions.question_type IS 'Tipo da pergunta: scale, multiple_choice, text, yes_no';
COMMENT ON COLUMN tool_questions.options IS 'Opções para perguntas de múltipla escolha';
COMMENT ON COLUMN tool_questions.scale_range IS 'Configuração da escala: {min, max, step}';
COMMENT ON COLUMN session_results.overall_score IS 'Pontuação geral da sessão (0-100)';
COMMENT ON COLUMN session_results.category_scores IS 'Pontuações por categoria em formato JSON';
COMMENT ON COLUMN session_results.insights IS 'Insights gerados em formato JSON';
COMMENT ON COLUMN session_results.recommendations IS 'Recomendações em formato JSON';
COMMENT ON COLUMN session_results.radar_data IS 'Dados para gráfico radar em formato JSON';
COMMENT ON COLUMN session_results.bar_chart_data IS 'Dados para gráfico de barras em formato JSON';
COMMENT ON COLUMN session_results.gauge_value IS 'Valor para gráfico gauge (0-100)';
COMMENT ON COLUMN session_schedules.status IS 'Status: pending, available, in_progress, completed, cancelled'; 