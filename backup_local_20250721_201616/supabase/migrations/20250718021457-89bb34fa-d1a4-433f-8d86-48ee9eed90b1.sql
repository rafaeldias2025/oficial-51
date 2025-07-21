-- Criar tabela para armazenar dados de saúde do Google Fit
CREATE TABLE IF NOT EXISTS public.google_fit_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL, -- 'weight', 'steps', 'heart_rate', etc.
  value NUMERIC NOT NULL,
  unit VARCHAR(20), -- 'kg', 'steps', 'bpm', etc.
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(50) DEFAULT 'google_fit',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_google_fit_user_id ON public.google_fit_data(user_id);
CREATE INDEX IF NOT EXISTS idx_google_fit_data_type ON public.google_fit_data(data_type);
CREATE INDEX IF NOT EXISTS idx_google_fit_timestamp ON public.google_fit_data(timestamp);

-- RLS Policies
ALTER TABLE public.google_fit_data ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios dados
CREATE POLICY "Users can view their own Google Fit data"
ON public.google_fit_data
FOR SELECT
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

-- Política para usuários criarem seus próprios dados
CREATE POLICY "Users can create their own Google Fit data"
ON public.google_fit_data
FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "Users can update their own Google Fit data"
ON public.google_fit_data
FOR UPDATE
USING (user_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

-- Política para admins verem todos os dados
CREATE POLICY "Admins can view all Google Fit data"
ON public.google_fit_data
FOR SELECT
USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_google_fit_data_updated_at
BEFORE UPDATE ON public.google_fit_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();