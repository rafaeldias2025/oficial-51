-- Limpar dados existentes
DELETE FROM public.profiles WHERE email = 'superadmin@institutodossonhos.com';
DELETE FROM auth.users WHERE email = 'superadmin@institutodossonhos.com';

-- Criar o usuário admin usando um email diferente temporariamente para evitar conflitos
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@institucao.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador Sistema"}',
  NOW(),
  NOW()
);

-- Criar profile para o admin
INSERT INTO public.profiles (
  user_id,
  email,
  full_name,
  role
)
SELECT 
  id,
  'admin@institucao.com',
  'Administrador Sistema',
  'admin'
FROM auth.users 
WHERE email = 'admin@institucao.com';