-- Script para adicionar a coluna role na tabela profiles
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Verificar estrutura atual
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Criar tipo user_role se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'client', 'visitor');
        RAISE NOTICE 'Tipo user_role criado';
    ELSE
        RAISE NOTICE 'Tipo user_role já existe';
    END IF;
END $$;

-- 3. Adicionar coluna role
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'client';

-- 4. Verificar se a coluna foi adicionada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 5. Atualizar perfis existentes
UPDATE profiles 
SET role = 'client' 
WHERE role IS NULL;

-- 6. Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email IN ('rafael@admin.com', 'admin@instituto.com', 'admin@sonhos.com') THEN 'admin'::user_role
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
      ELSE 'client'::user_role
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Verificar trigger
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 8. Criar perfis para usuários que não têm perfil
INSERT INTO profiles (user_id, email, full_name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN email IN ('rafael@admin.com', 'admin@instituto.com', 'admin@sonhos.com') THEN 'admin'::user_role
      ELSE 'client'::user_role
    END
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM profiles)
ON CONFLICT (user_id) DO NOTHING;

-- 9. Verificar resultado final
SELECT 
    user_id,
    email,
    full_name,
    role,
    created_at
FROM profiles 
ORDER BY created_at DESC; 