-- COMANDO FINAL PARA REMOVER USUÁRIO PROBLEMÁTICO
-- ✅ Execute este comando no SQL Editor do Supabase

-- 1. Verificar usuário problemático
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 2. Remover de todas as tabelas (execute um por vez)

-- Remover de profiles
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Remover de sessions  
DELETE FROM sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Remover de user_sessions
DELETE FROM user_sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Remover de assessments
DELETE FROM assessments 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Remover de assessment_responses
DELETE FROM assessment_responses 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Remover de user_tools
DELETE FROM user_tools 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Remover de user_courses
DELETE FROM user_courses 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 3. Tentar remover da tabela auth.users (pode não funcionar)
DELETE FROM auth.users 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 4. Verificar resultado
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 5. Listar todos os usuários
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC; 