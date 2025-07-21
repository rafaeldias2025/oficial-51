-- COMANDO SQL COMPLETO PARA REMOVER USUÁRIO PROBLEMÁTICO
-- ✅ Execute este comando no SQL Editor do Supabase

-- 1. Verificar se o usuário existe
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com'
   OR id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 2. Remover de todas as tabelas relacionadas
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
   OR email = 'deleted_superadmin@institutodossonhos.com';

DELETE FROM sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_data 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_preferences 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_activity 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM assessments 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM assessment_responses 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_tools 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM user_courses 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 3. Tentar remover da tabela auth.users (pode não funcionar devido a permissões)
DELETE FROM auth.users 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
   OR email = 'deleted_superadmin@institutodossonhos.com';

-- 4. Verificar se foi removido
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 5. Listar todos os usuários restantes
SELECT id, email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
ORDER BY created_at DESC; 