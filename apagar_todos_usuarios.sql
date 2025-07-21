-- COMANDO PARA APAGAR TODOS OS USUÁRIOS DE TESTE
-- ✅ Execute este comando no SQL Editor do Supabase

-- 1. Verificar quantos usuários existem
SELECT COUNT(*) as total_usuarios 
FROM auth.users;

-- 2. Listar todos os usuários antes de apagar
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Remover de todas as tabelas relacionadas
-- Remover de profiles
DELETE FROM profiles;

-- Remover de sessions
DELETE FROM sessions;

-- Remover de user_sessions
DELETE FROM user_sessions;

-- Remover de assessments
DELETE FROM assessments;

-- Remover de assessment_responses
DELETE FROM assessment_responses;

-- Remover de user_tools
DELETE FROM user_tools;

-- Remover de user_courses
DELETE FROM user_courses;

-- Remover de user_data
DELETE FROM user_data;

-- Remover de user_preferences
DELETE FROM user_preferences;

-- Remover de user_activity
DELETE FROM user_activity;

-- 4. Remover todos os usuários de auth.users
DELETE FROM auth.users;

-- 5. Verificar se foram removidos
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users;

-- 6. Verificar profiles restantes
SELECT COUNT(*) as profiles_restantes 
FROM profiles; 