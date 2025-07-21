-- Script para verificar a estrutura da tabela profiles
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Verificar a estrutura da tabela profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Verificar se a coluna role existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'role';

-- 3. Se a coluna role não existir, vamos criá-la
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

-- 4. Verificar novamente a estrutura
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 5. Verificar se o trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 6. Se o trigger não existir, vamos criá-lo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        -- Criar a função
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

        -- Criar o trigger
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
        RAISE NOTICE 'Trigger on_auth_user_created criado';
    ELSE
        RAISE NOTICE 'Trigger on_auth_user_created já existe';
    END IF;
END $$;

-- 7. Verificar se tudo está funcionando
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'; 