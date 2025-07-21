-- Atualizar senha do admin existente para algo simples
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@instituto.com';