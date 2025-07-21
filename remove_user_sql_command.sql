-- Comando SQL para remover o usuário problemático
-- ✅ Execute este comando no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar se o usuário existe
SELECT id, email, raw_user_meta_data, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com'
   OR id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 2. Remover dados de profiles
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
   OR email = 'deleted_superadmin@institutodossonhos.com';

-- 3. Remover dados de sessions
DELETE FROM sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 4. Remover dados de outras tabelas relacionadas
DELETE FROM user_sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_data 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_preferences 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_activity 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 5. Remover o usuário da tabela auth.users
-- ⚠️ ATENÇÃO: Este comando pode não funcionar devido a permissões
DELETE FROM auth.users 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
   OR email = 'deleted_superadmin@institutodossonhos.com';

-- 6. Verificar se foi removido
SELECT COUNT(*) as total_users 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 7. Listar todos os usuários restantes
SELECT id, email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
ORDER BY created_at DESC; 