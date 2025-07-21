
-- Criar tabela para armazenar respostas das ferramentas de roda
CREATE TABLE IF NOT EXISTS public.wheel_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id VARCHAR NOT NULL,
  wheel_type VARCHAR NOT NULL CHECK (wheel_type IN ('energia_vital', 'roda_vida', 'saude_energia')),
  responses JSONB NOT NULL DEFAULT '{}',
  reflection_answers JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, session_id, wheel_type)
);

-- Adicionar RLS
ALTER TABLE public.wheel_responses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para wheel_responses
CREATE POLICY "Users can view their own wheel responses" 
  ON public.wheel_responses FOR SELECT 
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own wheel responses" 
  ON public.wheel_responses FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own wheel responses" 
  ON public.wheel_responses FOR UPDATE 
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all wheel responses" 
  ON public.wheel_responses FOR SELECT 
  USING (is_admin(auth.uid()));

-- Atualizar tabela sessions para incluir ferramentas disponíveis
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS available_tools TEXT[] DEFAULT ARRAY['energia_vital'];

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_wheel_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wheel_responses_updated_at_trigger
  BEFORE UPDATE ON public.wheel_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_wheel_responses_updated_at();
