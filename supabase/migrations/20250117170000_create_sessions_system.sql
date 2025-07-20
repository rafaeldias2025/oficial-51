-- Migração para criar o sistema de sessões de coaching
-- Data: 2025-01-17

-- 1. Criar tabela de ferramentas de coaching
CREATE TABLE IF NOT EXISTS coaching_tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  total_questions INTEGER DEFAULT 0,
  estimated_time INTEGER DEFAULT 15, -- em minutos
  question_data JSONB,
  scoring_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de sessões de coaching
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_id INTEGER REFERENCES coaching_tools(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de respostas das sessões
CREATE TABLE IF NOT EXISTS session_responses (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  response_value TEXT,
  response_text TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de resultados das sessões
CREATE TABLE IF NOT EXISTS session_results (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  total_score DECIMAL(5,2),
  category_scores JSONB,
  insights TEXT[],
  recommendations TEXT[],
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_tool_id ON coaching_sessions(tool_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_status ON coaching_sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_responses_session_id ON session_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_session_results_session_id ON session_results(session_id);

-- 6. Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coaching_tools_updated_at BEFORE UPDATE ON coaching_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Configurar RLS (Row Level Security)
ALTER TABLE coaching_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_results ENABLE ROW LEVEL SECURITY;

-- 8. Políticas RLS para coaching_tools (todos podem ler, apenas admins podem modificar)
CREATE POLICY "coaching_tools_select_policy" ON coaching_tools FOR SELECT USING (true);
CREATE POLICY "coaching_tools_insert_policy" ON coaching_tools FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "coaching_tools_update_policy" ON coaching_tools FOR UPDATE USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "coaching_tools_delete_policy" ON coaching_tools FOR DELETE USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);

-- 9. Políticas RLS para coaching_sessions
CREATE POLICY "coaching_sessions_select_policy" ON coaching_sessions FOR SELECT USING (
  user_id = auth.uid() OR 
  admin_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "coaching_sessions_insert_policy" ON coaching_sessions FOR INSERT WITH CHECK (
  admin_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "coaching_sessions_update_policy" ON coaching_sessions FOR UPDATE USING (
  user_id = auth.uid() OR 
  admin_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "coaching_sessions_delete_policy" ON coaching_sessions FOR DELETE USING (
  admin_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);

-- 10. Políticas RLS para session_responses
CREATE POLICY "session_responses_select_policy" ON session_responses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM coaching_sessions 
    WHERE coaching_sessions.id = session_responses.session_id 
    AND (coaching_sessions.user_id = auth.uid() OR coaching_sessions.admin_id = auth.uid())
  ) OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "session_responses_insert_policy" ON session_responses FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM coaching_sessions 
    WHERE coaching_sessions.id = session_responses.session_id 
    AND coaching_sessions.user_id = auth.uid()
  )
);
CREATE POLICY "session_responses_update_policy" ON session_responses FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM coaching_sessions 
    WHERE coaching_sessions.id = session_responses.session_id 
    AND coaching_sessions.user_id = auth.uid()
  )
);

-- 11. Políticas RLS para session_results
CREATE POLICY "session_results_select_policy" ON session_results FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM coaching_sessions 
    WHERE coaching_sessions.id = session_results.session_id 
    AND (coaching_sessions.user_id = auth.uid() OR coaching_sessions.admin_id = auth.uid())
  ) OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
CREATE POLICY "session_results_insert_policy" ON session_results FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM coaching_sessions 
    WHERE coaching_sessions.id = session_results.session_id 
    AND coaching_sessions.user_id = auth.uid()
  )
); 