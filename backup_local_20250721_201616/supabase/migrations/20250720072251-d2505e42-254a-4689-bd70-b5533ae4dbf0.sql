-- Corrigir problemas de permissão para administradores no storage
-- O problema está nas políticas de storage duplicadas e inconsistentes

-- Remover políticas duplicadas e problemáticas do storage
DROP POLICY IF EXISTS "Admins can view course-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to course-images" ON storage.objects;

-- Garantir que todas as políticas usem a função is_admin() consistentemente
-- para administradores terem acesso completo ao storage

-- Política unificada para administradores verem todos os objetos de storage
CREATE POLICY "Admins can view all storage objects" ON storage.objects
FOR SELECT USING (is_admin(auth.uid()));

-- Política unificada para administradores criarem objetos em qualquer bucket
CREATE POLICY "Admins can upload to any bucket" ON storage.objects
FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Política unificada para administradores atualizarem objetos em qualquer bucket
CREATE POLICY "Admins can update any storage object" ON storage.objects
FOR UPDATE USING (is_admin(auth.uid()));

-- Garantir que a função is_admin seja SECURITY DEFINER para funcionar corretamente
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- Verificar se existem usuários admin no sistema
-- Se não existir, criar um admin padrão
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    -- Inserir um profile admin se não existir nenhum
    INSERT INTO public.profiles (user_id, email, role, full_name)
    VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      'admin@sistema.com',
      'admin',
      'Administrador do Sistema'
    ) ON CONFLICT (user_id) DO UPDATE SET
      role = 'admin',
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name;
  END IF;
END $$;