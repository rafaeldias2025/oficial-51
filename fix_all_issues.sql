-- Script completo para corrigir todos os problemas
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Verificar estrutura atual da tabela profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Adicionar coluna role se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'client';
        RAISE NOTICE 'Coluna role adicionada à tabela profiles';
    ELSE
        RAISE NOTICE 'Coluna role já existe na tabela profiles';
    END IF;
END $$;

-- 3. Verificar se o tipo user_role existe
SELECT typname FROM pg_type WHERE typname = 'user_role';

-- 4. Se o tipo não existir, criá-lo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'client', 'visitor');
        RAISE NOTICE 'Tipo user_role criado';
    ELSE
        RAISE NOTICE 'Tipo user_role já existe';
    END IF;
END $$;

-- 5. Recriar função e trigger
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

-- 6. Verificar se o trigger foi criado
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 7. Atualizar perfis existentes que não têm role
UPDATE profiles 
SET role = 'client' 
WHERE role IS NULL;

-- 8. Verificar estrutura final da tabela profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 9. Verificar perfis existentes
SELECT 
    user_id,
    email,
    full_name,
    role,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 10. Testar criação de um usuário
-- (Este comando será executado manualmente para testar)
-- INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, is_super_admin, confirmed_at, email_change, email_change_token_new, recovery_token)
-- VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'teste@exemplo.com', crypt('Teste123!', gen_salt('bf')), now(), now(), now(), '{"full_name": "Usuário Teste", "role": "client"}', false, now(), '', '', ''); 