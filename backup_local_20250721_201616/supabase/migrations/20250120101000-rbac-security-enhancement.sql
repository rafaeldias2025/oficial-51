-- =====================================================
-- MIGRAÇÃO PARA RBAC E SECURITY ENHANCEMENT
-- =====================================================

-- Adicionar coluna is_active na tabela profiles se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
    ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Criar tabela para logs administrativos
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'user', 'course', 'storage', etc.
  target_id TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela admin_logs
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ler logs
CREATE POLICY "Admins can view all admin logs" 
ON public.admin_logs 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Apenas admins podem criar logs (sistema irá inserir automaticamente)
CREATE POLICY "Admins can create admin logs" 
ON public.admin_logs 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- =====================================================
-- FUNÇÕES AUXILIARES PARA RBAC
-- =====================================================

-- Função para verificar se usuário é admin (melhorada)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
  user_email TEXT;
BEGIN
  -- Lista de emails administrativos
  user_email := (SELECT email FROM auth.users WHERE id = user_id);
  
  IF user_email IN (
    'admin@instituto.com',
    'admin@sonhos.com', 
    'rafael@admin.com',
    'rafael@institutodossonhos.com',
    'institutodossonhos@gmail.com',
    'admin@test.com'
  ) THEN
    RETURN true;
  END IF;
  
  -- Verificar role na tabela profiles
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE user_id = $1;
  
  RETURN user_role = 'admin';
END;
$$;

-- Função para log automático de ações administrativas
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_type TEXT;
  target_type TEXT;
  old_data JSONB;
  new_data JSONB;
BEGIN
  -- Determinar tipo de ação
  IF TG_OP = 'INSERT' THEN
    action_type := TG_TABLE_NAME || '_created';
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := TG_TABLE_NAME || '_updated';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    action_type := TG_TABLE_NAME || '_deleted';
    old_data := to_jsonb(OLD);
  END IF;

  -- Determinar tipo de target
  target_type := TG_TABLE_NAME;

  -- Inserir log apenas se for ação de admin
  IF is_admin(auth.uid()) THEN
    INSERT INTO public.admin_logs (
      actor_id,
      action,
      target_type,
      target_id,
      details,
      created_at
    ) VALUES (
      auth.uid(),
      action_type,
      target_type,
      COALESCE(NEW.id::TEXT, OLD.id::TEXT),
      jsonb_build_object(
        'old_data', old_data,
        'new_data', new_data,
        'table', TG_TABLE_NAME,
        'operation', TG_OP
      ),
      now()
    );
  END IF;

  -- Retornar registro apropriado
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- =====================================================
-- POLÍTICAS RLS MELHORADAS
-- =====================================================

-- Atualizar políticas da tabela profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Políticas mais restritivas para profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (is_admin(auth.uid()));

-- Políticas para user_points (apenas admins podem alterar pontos manualmente)
DROP POLICY IF EXISTS "Users can view their own points" ON public.user_points;
DROP POLICY IF EXISTS "Users can create their own points record" ON public.user_points;
DROP POLICY IF EXISTS "Users can update their own points" ON public.user_points;
DROP POLICY IF EXISTS "Everyone can view all points for ranking" ON public.user_points;
DROP POLICY IF EXISTS "Admins can view all points" ON public.user_points;

CREATE POLICY "Everyone can view all points for ranking" 
ON public.user_points 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "System can create points records" 
ON public.user_points 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manually update points" 
ON public.user_points 
FOR UPDATE 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Políticas restritivas para cursos (apenas admins podem modificar)
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Everyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;

CREATE POLICY "Everyone can view active courses" 
ON public.courses 
FOR SELECT 
USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can manage courses" 
ON public.courses 
FOR ALL 
USING (is_admin(auth.uid()));

-- Políticas similares para course_modules e course_lessons
DROP POLICY IF EXISTS "Anyone can view active modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.course_modules;
DROP POLICY IF EXISTS "Everyone can view active modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage all modules" ON public.course_modules;

CREATE POLICY "Everyone can view active modules" 
ON public.course_modules 
FOR SELECT 
USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can manage modules" 
ON public.course_modules 
FOR ALL 
USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view active lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Everyone can view active lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.course_lessons;

CREATE POLICY "Everyone can view active lessons" 
ON public.course_lessons 
FOR SELECT 
USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can manage lessons" 
ON public.course_lessons 
FOR ALL 
USING (is_admin(auth.uid()));

-- =====================================================
-- TRIGGERS PARA LOG AUTOMÁTICO
-- =====================================================

-- Trigger para log de alterações em profiles
DROP TRIGGER IF EXISTS profile_admin_log_trigger ON public.profiles;
CREATE TRIGGER profile_admin_log_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

-- Trigger para log de alterações em cursos
DROP TRIGGER IF EXISTS course_admin_log_trigger ON public.courses;
CREATE TRIGGER course_admin_log_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

-- Trigger para log de alterações em pontos (apenas updates manuais por admin)
DROP TRIGGER IF EXISTS user_points_admin_log_trigger ON public.user_points;
CREATE TRIGGER user_points_admin_log_trigger
  AFTER UPDATE ON public.user_points
  FOR EACH ROW
  WHEN (is_admin(auth.uid()))
  EXECUTE FUNCTION log_admin_action();

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para admin_logs
CREATE INDEX IF NOT EXISTS idx_admin_logs_actor_id ON public.admin_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target_type ON public.admin_logs(target_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target_id ON public.admin_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at);

-- Índice para is_active em profiles
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =====================================================
-- FUNÇÕES DE UTILIDADE ADMIN
-- =====================================================

-- Função para buscar logs de um usuário específico
CREATE OR REPLACE FUNCTION get_user_admin_logs(target_user_id TEXT)
RETURNS TABLE (
  id UUID,
  actor_email TEXT,
  action TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Apenas admins podem ver logs
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem ver logs';
  END IF;

  RETURN QUERY
  SELECT 
    al.id,
    au.email as actor_email,
    al.action,
    al.details,
    al.created_at
  FROM public.admin_logs al
  LEFT JOIN auth.users au ON al.actor_id = au.id
  WHERE al.target_id = target_user_id
  ORDER BY al.created_at DESC;
END;
$$;

-- Função para estatísticas de segurança
CREATE OR REPLACE FUNCTION get_security_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
BEGIN
  -- Apenas admins podem ver estatísticas
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem ver estatísticas';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'active_users', (SELECT COUNT(*) FROM public.profiles WHERE is_active = true),
    'inactive_users', (SELECT COUNT(*) FROM public.profiles WHERE is_active = false),
    'admin_users', (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'),
    'client_users', (SELECT COUNT(*) FROM public.profiles WHERE role = 'client'),
    'visitor_users', (SELECT COUNT(*) FROM public.profiles WHERE role = 'visitor'),
    'total_admin_actions', (SELECT COUNT(*) FROM public.admin_logs),
    'recent_admin_actions', (
      SELECT COUNT(*) FROM public.admin_logs 
      WHERE created_at > now() - interval '24 hours'
    ),
    'active_courses', (SELECT COUNT(*) FROM public.courses WHERE is_active = true),
    'inactive_courses', (SELECT COUNT(*) FROM public.courses WHERE is_active = false)
  ) INTO stats;

  RETURN stats;
END;
$$;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.admin_logs IS 'Log de todas as ações administrativas no sistema';
COMMENT ON FUNCTION is_admin(UUID) IS 'Verifica se um usuário tem privilégios administrativos';
COMMENT ON FUNCTION log_admin_action() IS 'Trigger function para log automático de ações administrativas';
COMMENT ON FUNCTION get_user_admin_logs(TEXT) IS 'Retorna logs administrativos de um usuário específico';
COMMENT ON FUNCTION get_security_stats() IS 'Retorna estatísticas de segurança do sistema';

-- Atualizar comentários de colunas
COMMENT ON COLUMN public.profiles.is_active IS 'Indica se o usuário está ativo no sistema';
COMMENT ON COLUMN public.profiles.role IS 'Role do usuário: admin, client, ou visitor';

-- =====================================================
-- DADOS INICIAIS E VALIDAÇÃO
-- =====================================================

-- Garantir que todos os perfis tenham is_active definido
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;

-- Criar registro de admin inicial se não existir
INSERT INTO public.profiles (user_id, email, full_name, role, is_active)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@instituto.com' LIMIT 1),
  'admin@instituto.com',
  'Administrador',
  'admin',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE email = 'admin@instituto.com'
) AND EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@instituto.com'
);

-- Log inicial do sistema
INSERT INTO public.admin_logs (action, target_type, target_id, details)
VALUES (
  'system_security_upgrade',
  'system',
  'rbac_migration',
  jsonb_build_object(
    'version', '1.0',
    'description', 'RBAC and security enhancement migration applied',
    'timestamp', now()
  )
); 