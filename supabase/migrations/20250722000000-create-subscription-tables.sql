-- =====================================================
-- MIGRAÇÃO PARA CRIAR TABELAS DE ASSINATURAS
-- =====================================================

-- Criar tipo enum para status de assinatura
CREATE TYPE public.subscription_status AS ENUM (
  'active',
  'canceled',
  'expired',
  'trial',
  'pending'
);

-- Criar tabela de planos de assinatura
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'pending',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method TEXT,
  payment_provider TEXT,
  payment_provider_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico de pagamentos
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_provider TEXT,
  payment_provider_id TEXT,
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para subscription_plans
CREATE POLICY "Everyone can view active plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all plans" ON public.subscription_plans
  FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para subscription_payments
CREATE POLICY "Users can view their own payments" ON public.subscription_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = subscription_payments.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments" ON public.subscription_payments
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all payments" ON public.subscription_payments
  FOR ALL USING (is_admin(auth.uid()));

-- Adicionar coluna de assinatura ao perfil do usuário
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_active_subscription BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON public.subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON public.subscription_payments(subscription_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_payments_updated_at
  BEFORE UPDATE ON public.subscription_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir planos iniciais
INSERT INTO public.subscription_plans (name, description, price, interval, features, is_active)
VALUES 
('Plano Mensal', 'Acesso a todos os recursos premium por 30 dias', 29.90, 'monthly', 
 '[
    "Acesso a todos os cursos premium",
    "Suporte prioritário",
    "Conteúdo exclusivo",
    "Ferramentas avançadas de acompanhamento"
  ]'::jsonb, 
 true),
('Plano Anual', 'Acesso a todos os recursos premium por 12 meses com desconto', 299.90, 'yearly', 
 '[
    "Acesso a todos os cursos premium",
    "Suporte prioritário",
    "Conteúdo exclusivo",
    "Ferramentas avançadas de acompanhamento",
    "Consultas personalizadas",
    "2 meses grátis"
  ]'::jsonb, 
 true);

-- Função para verificar se um usuário tem assinatura ativa
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active'
    AND current_period_end > now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 