-- Criar tabela para armazenar credenciais OAuth do Google dos usuários
CREATE TABLE IF NOT EXISTS public.user_google_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_google_credentials ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Users can manage their own Google credentials" 
ON public.user_google_credentials 
FOR ALL 
USING (email = (auth.jwt() -> 'email')::text);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_google_credentials_updated_at
  BEFORE UPDATE ON public.user_google_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();