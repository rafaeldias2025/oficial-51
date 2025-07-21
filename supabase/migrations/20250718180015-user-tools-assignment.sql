-- Criar tabela para gerenciar a atribuição de ferramentas aos usuários
CREATE TABLE IF NOT EXISTS public.user_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id INTEGER NOT NULL REFERENCES coaching_tools(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_date TIMESTAMP WITH TIME ZONE,
  custom_message TEXT,
  notification_sent BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, tool_id, sent_date)
);

-- Adicionar RLS
ALTER TABLE public.user_tools ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_tools
CREATE POLICY "Users can view their own tools" 
  ON public.user_tools FOR SELECT 
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all tools" 
  ON public.user_tools FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert tools" 
  ON public.user_tools FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update tools" 
  ON public.user_tools FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can update their own tools status" 
  ON public.user_tools FOR UPDATE 
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (
    (OLD.status <> NEW.status OR OLD.completed_date IS NULL AND NEW.completed_date IS NOT NULL)
    AND (NEW.user_id = OLD.user_id)
    AND (NEW.tool_id = OLD.tool_id)
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_tools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_tools_updated_at_trigger
  BEFORE UPDATE ON public.user_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tools_updated_at();

-- Índices para melhorar performance
CREATE INDEX idx_user_tools_user_id ON public.user_tools(user_id);
CREATE INDEX idx_user_tools_tool_id ON public.user_tools(tool_id);
CREATE INDEX idx_user_tools_status ON public.user_tools(status);
CREATE INDEX idx_user_tools_scheduled_date ON public.user_tools(scheduled_date); 