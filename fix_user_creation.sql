-- Script para corrigir a criação de usuários
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Primeiro, vamos verificar a estrutura da tabela profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Vamos verificar se o trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 3. Vamos recriar a função e trigger corretamente
-- Primeiro, vamos dropar o trigger e função existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Agora vamos recriar a função (sem a coluna celular se ela não existir)
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
    -- Log the error and re-raise it
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$function$;

-- 5. Agora vamos criar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Vamos verificar se foi criado corretamente
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 7. Vamos criar o usuário admin se não existir
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    is_super_admin,
    confirmed_at,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@sonhos.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "Administrador Sistema", "role": "admin"}',
    false,
    now(),
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- 8. Vamos verificar se o usuário admin foi criado
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@sonhos.com';

-- 9. Se o usuário admin foi criado mas não tem perfil, vamos criar o perfil
INSERT INTO profiles (user_id, email, full_name, role)
SELECT 
    id,
    'admin@sonhos.com',
    'Administrador Sistema',
    'admin'
FROM auth.users 
WHERE email = 'admin@sonhos.com' 
AND id NOT IN (SELECT user_id FROM profiles)
ON CONFLICT (user_id) DO NOTHING;

-- 10. Vamos verificar se tudo está funcionando
SELECT 
    u.email,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'admin@sonhos.com'; 