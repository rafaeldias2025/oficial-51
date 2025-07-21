-- Script para remover os 3 usuários específicos
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Primeiro, vamos verificar os usuários que serão removidos
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email IN (
    'teste-1753134508492@exemplo.com',
    'admin@example.com',
    'claude@example.com'
)
ORDER BY created_at;

-- 2. Remover perfis desses usuários específicos
DELETE FROM profiles 
WHERE user_id IN (
    'b98cfa80-9d8d-4640-ac25-620b3cc2e75b',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002'
);

-- 3. Remover os usuários específicos
DELETE FROM auth.users 
WHERE email IN (
    'teste-1753134508492@exemplo.com',
    'admin@example.com',
    'claude@example.com'
);

-- 4. Verificar se foram removidos
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email IN (
    'teste-1753134508492@exemplo.com',
    'admin@example.com',
    'claude@example.com'
);

-- 5. Verificar usuários restantes
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 6. Verificar perfis restantes
SELECT 
    user_id,
    email,
    role,
    full_name
FROM profiles 
ORDER BY created_at DESC; 