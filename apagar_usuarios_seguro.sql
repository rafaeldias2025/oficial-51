-- COMANDO SEGURO PARA APAGAR TODOS OS USUÁRIOS DE TESTE
-- ✅ Execute este comando no SQL Editor do Supabase

-- 1. Verificar quantos usuários existem
SELECT COUNT(*) as total_usuarios 
FROM auth.users;

-- 2. Listar todos os usuários
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Remover de profiles (execute primeiro)
DELETE FROM profiles;

-- 4. Verificar se profiles foi limpo
SELECT COUNT(*) as profiles_restantes 
FROM profiles;

-- 5. Remover de sessions
DELETE FROM sessions;

-- 6. Remover de user_sessions
DELETE FROM user_sessions;

-- 7. Remover de assessments
DELETE FROM assessments;

-- 8. Remover de assessment_responses
DELETE FROM assessment_responses;

-- 9. Remover de user_tools
DELETE FROM user_tools;

-- 10. Remover de user_courses
DELETE FROM user_courses;

-- 11. Remover de user_data
DELETE FROM user_data;

-- 12. Remover de user_preferences
DELETE FROM user_preferences;

-- 13. Remover de user_activity
DELETE FROM user_activity;

-- 14. Remover todos os usuários de auth.users
DELETE FROM auth.users;

-- 15. Verificação final
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users;

SELECT COUNT(*) as profiles_restantes 
FROM profiles; 