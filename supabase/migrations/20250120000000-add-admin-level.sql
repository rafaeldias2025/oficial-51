-- Adicionar coluna admin_level à tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin_level INTEGER DEFAULT 0;

-- Atualizar usuário super admin
UPDATE profiles 
SET admin_level = 999,
    full_name = 'Super Administrador - Acesso Total',
    email = 'superadmin@institutodossonhos.com'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_admin_level ON profiles(admin_level);

-- Comentário sobre os níveis de admin
COMMENT ON COLUMN profiles.admin_level IS 'Níveis de admin: 0=usuário, 100=admin, 999=super admin'; 