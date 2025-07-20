-- Sistema de Feedback de Sessões
-- Criado em: 19/01/2025

-- Tabela principal para feedback de sessões
CREATE TABLE IF NOT EXISTS session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_data JSONB NOT NULL,
  analysis_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para insights específicos do feedback
CREATE TABLE IF NOT EXISTS feedback_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES session_feedback(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('strength', 'weakness', 'trend', 'pattern')),
  insight_data JSONB,
  title VARCHAR(255),
  description TEXT,
  impact VARCHAR(20) CHECK (impact IN ('high', 'medium', 'low')),
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  actionable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para recomendações do feedback
CREATE TABLE IF NOT EXISTS feedback_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES session_feedback(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  action_items JSONB,
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para tendências de desenvolvimento
CREATE TABLE IF NOT EXISTS feedback_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES session_feedback(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  current_score DECIMAL(4,2),
  previous_score DECIMAL(4,2),
  change_amount DECIMAL(4,2),
  trend_direction VARCHAR(20) CHECK (trend_direction IN ('improvement', 'decline', 'stable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_session_feedback_session_id ON session_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_user_id ON session_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_created_at ON session_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_feedback_insights_feedback_id ON feedback_insights(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_insights_type ON feedback_insights(insight_type);

CREATE INDEX IF NOT EXISTS idx_feedback_recommendations_feedback_id ON feedback_recommendations(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_recommendations_priority ON feedback_recommendations(priority);

CREATE INDEX IF NOT EXISTS idx_feedback_trends_feedback_id ON feedback_trends(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_trends_category ON feedback_trends(category);

-- Políticas RLS (Row Level Security)
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_trends ENABLE ROW LEVEL SECURITY;

-- Políticas para session_feedback
CREATE POLICY "Users can view their own session feedback" ON session_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session feedback" ON session_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session feedback" ON session_feedback
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all session feedback" ON session_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Políticas para feedback_insights
CREATE POLICY "Users can view their own feedback insights" ON feedback_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM session_feedback 
      WHERE session_feedback.id = feedback_insights.feedback_id 
      AND session_feedback.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own feedback insights" ON feedback_insights
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM session_feedback 
      WHERE session_feedback.id = feedback_insights.feedback_id 
      AND session_feedback.user_id = auth.uid()
    )
  );

-- Políticas para feedback_recommendations
CREATE POLICY "Users can view their own feedback recommendations" ON feedback_recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM session_feedback 
      WHERE session_feedback.id = feedback_recommendations.feedback_id 
      AND session_feedback.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own feedback recommendations" ON feedback_recommendations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM session_feedback 
      WHERE session_feedback.id = feedback_recommendations.feedback_id 
      AND session_feedback.user_id = auth.uid()
    )
  );

-- Políticas para feedback_trends
CREATE POLICY "Users can view their own feedback trends" ON feedback_trends
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM session_feedback 
      WHERE session_feedback.id = feedback_trends.feedback_id 
      AND session_feedback.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own feedback trends" ON feedback_trends
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM session_feedback 
      WHERE session_feedback.id = feedback_trends.feedback_id 
      AND session_feedback.user_id = auth.uid()
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_session_feedback_updated_at 
  BEFORE UPDATE ON session_feedback 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE session_feedback IS 'Armazena feedback completo de sessões de coaching';
COMMENT ON TABLE feedback_insights IS 'Insights específicos gerados a partir do feedback';
COMMENT ON TABLE feedback_recommendations IS 'Recomendações personalizadas baseadas no feedback';
COMMENT ON TABLE feedback_trends IS 'Tendências de desenvolvimento ao longo do tempo';

COMMENT ON COLUMN session_feedback.feedback_data IS 'Dados completos do feedback em formato JSON';
COMMENT ON COLUMN session_feedback.analysis_summary IS 'Resumo da análise em texto';
COMMENT ON COLUMN feedback_insights.insight_type IS 'Tipo do insight: strength, weakness, trend, pattern';
COMMENT ON COLUMN feedback_insights.confidence IS 'Nível de confiança do insight (0-1)';
COMMENT ON COLUMN feedback_insights.actionable IS 'Se o insight requer ação do usuário';
COMMENT ON COLUMN feedback_recommendations.priority IS 'Prioridade da recomendação: high, medium, low';
COMMENT ON COLUMN feedback_trends.trend_direction IS 'Direção da tendência: improvement, decline, stable'; 