-- Script para remover usuários de teste
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Primeiro, vamos verificar quais usuários de teste existem
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email LIKE 'teste-%@exemplo.com'
ORDER BY created_at;

-- 2. Remover perfis dos usuários de teste
DELETE FROM profiles 
WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email LIKE 'teste-%@exemplo.com'
);

-- 3. Remover os usuários de teste
DELETE FROM auth.users 
WHERE email LIKE 'teste-%@exemplo.com';

-- 4. Verificar se foram removidos
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email LIKE 'teste-%@exemplo.com';

-- 5. Verificar perfis restantes
SELECT 
    user_id,
    email,
    role,
    full_name
FROM profiles 
ORDER BY created_at DESC; 