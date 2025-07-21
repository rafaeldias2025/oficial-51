-- Criar tabela session_tools
CREATE TABLE IF NOT EXISTS session_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  tool VARCHAR(50) NOT NULL,
  tool_name VARCHAR(255) NOT NULL,
  tool_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_session_tools_session_id ON session_tools(session_id);
CREATE INDEX IF NOT EXISTS idx_session_tools_tool ON session_tools(tool);

-- Inserir ferramenta da sessão criada
INSERT INTO session_tools (session_id, tool, tool_name, tool_description)
VALUES (
  '9e9e60cc-66e2-43f5-a3dc-8a545a350e9c',
  'gratidao_proposito',
  'Roda de Gratidão e Propósito',
  'Explore sua gratidão e clareza de propósito em 6 dimensões'
); 