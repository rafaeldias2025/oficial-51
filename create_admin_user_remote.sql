-- Script para criar usuário admin no Supabase remoto
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar se o usuário já existe
SELECT email, created_at FROM auth.users WHERE email = 'admin@sonhos.com';

-- 2. Se não existir, você pode criar o usuário via interface do Supabase:
-- Vá para Authentication > Users > Add User
-- Email: admin@sonhos.com
-- Password: Admin123!
-- Confirme a senha: Admin123!

-- 3. Depois que criar o usuário, execute este script para garantir que o perfil seja criado corretamente:
INSERT INTO profiles (
  user_id,
  email,
  full_name,
  role,
  celular,
  data_nascimento,
  sexo,
  altura_cm,
  created_at,
  updated_at
) 
SELECT 
  id,
  'admin@sonhos.com',
  'Administrador Sistema',
  'admin',
  '(11) 99999-9999',
  '1990-01-01',
  'masculino',
  180,
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@sonhos.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.users.id
);

-- 4. Verificar se o perfil foi criado corretamente
SELECT 
  p.id,
  p.full_name,
  p.role,
  u.email,
  u.created_at
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'admin@sonhos.com';

-- 5. Se o perfil já existe mas não tem role admin, atualizar:
UPDATE profiles 
SET role = 'admin', 
    updated_at = now()
WHERE email = 'admin@sonhos.com' 
AND role != 'admin'; 