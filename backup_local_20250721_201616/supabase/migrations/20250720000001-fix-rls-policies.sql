-- Corrigir políticas RLS para permitir que admins criem cursos e módulos
-- O problema é que as políticas estão muito restritivas

-- Remover políticas problemáticas
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.course_lessons;

-- Criar políticas mais permissivas para admins
CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all modules" ON public.course_modules
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all lessons" ON public.course_lessons
  FOR ALL USING (is_admin(auth.uid()));

-- Garantir que usuários autenticados possam visualizar cursos ativos
CREATE POLICY "Authenticated users can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view active modules" ON public.course_modules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view active lessons" ON public.course_lessons
  FOR SELECT USING (is_active = true);

-- Verificar se a função is_admin existe
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = is_admin.user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que o perfil do admin existe
INSERT INTO public.profiles (id, user_id, email, role, is_active)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@instituto.com' LIMIT 1),
  'admin@instituto.com',
  'admin',
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  is_active = true; 