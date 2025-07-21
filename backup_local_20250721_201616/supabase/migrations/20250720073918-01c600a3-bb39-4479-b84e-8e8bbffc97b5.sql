-- Criar super admin com acesso total
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  phone_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'superadmin@institutodossonhos.com',
  '$2a$10$7K8xGEm9YklCdlK9nw8nOOGxDxKGlJJ8qXZKaA8ZOzZJ7oqBfq9dC', -- senha: superadmin123
  now(),
  now(),
  '',
  '',
  '',
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Super Administrador", "email": "superadmin@institutodossonhos.com"}',
  false,
  now(),
  now(),
  null,
  '',
  '',
  '',
  0,
  null,
  '',
  null,
  false,
  null
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

-- Criar profile para o super admin
INSERT INTO public.profiles (
  id,
  user_id,
  email,
  full_name,
  role,
  admin_level,
  created_at,
  updated_at
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'superadmin@institutodossonhos.com',
  'Super Administrador - Acesso Total',
  'admin',
  999,
  now(),
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  admin_level = EXCLUDED.admin_level,
  updated_at = now();