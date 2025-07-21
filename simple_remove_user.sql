-- Comando SQL SIMPLES para remover usuário problemático
-- ✅ Execute no SQL Editor do Supabase

-- 1. Verificar usuário problemático
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 2. Remover apenas da tabela profiles (mais seguro)
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 3. Verificar se foi removido
SELECT COUNT(*) as profiles_restantes 
FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 4. Listar todos os profiles restantes
SELECT user_id, email, role 
FROM profiles 
ORDER BY created_at DESC; 