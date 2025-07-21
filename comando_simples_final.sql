-- COMANDO SIMPLES PARA REMOVER USUÁRIO PROBLEMÁTICO
-- ✅ Execute este comando no SQL Editor do Supabase

-- 1. Verificar usuário
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 2. Remover de profiles
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 3. Remover de auth.users (CORRETO)
DELETE FROM auth.users 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 4. Verificar se foi removido
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 5. Listar usuários restantes
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC; 