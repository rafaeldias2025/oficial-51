import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdminLevelColumn() {
  try {
    console.log('🔄 Adicionando coluna admin_level à tabela profiles...');

    // 1. Adicionar coluna admin_level usando SQL direto
    const { error: alterError } = await supabase
      .rpc('exec_sql', {
        sql: `
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS admin_level INTEGER DEFAULT 0;
        `
      });

    if (alterError) {
      console.log('⚠️ Erro ao adicionar coluna (pode já existir):', alterError.message);
    } else {
      console.log('✅ Coluna admin_level adicionada com sucesso');
    }

    // 2. Atualizar o usuário super admin com admin_level = 999 (super admin)
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Super Administrador - Acesso Total',
        email: 'superadmin@institutodossonhos.com',
        admin_level: 999
      })
      .eq('id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar usuário:', updateError);
      return;
    }

    console.log('✅ Usuário atualizado com admin_level = 999');

    // 3. Verificar se a atualização foi bem-sucedida
    const { data: checkUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .single();

    if (checkError) {
      console.error('❌ Erro ao verificar usuário:', checkError);
      return;
    }

    console.log('🎉 SUPER ADMIN CONFIGURADO COM SUCESSO!');
    console.log('👑 Email: superadmin@institutodossonhos.com');
    console.log('🔑 Senha: superadmin123');
    console.log('🆔 ID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    console.log('📋 Nome: Super Administrador - Acesso Total');
    console.log('🔐 admin_level: 999 (Super Admin)');

    console.log('\n📋 PERMISSÕES CONFIGURADAS:');
    console.log('✅ admin_level: 999 (Super Admin)');
    console.log('✅ Acesso total a todas as seções');
    console.log('✅ Pode gerenciar sessões');
    console.log('✅ Pode enviar ferramentas');
    console.log('✅ Pode acessar todas as áreas');

    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('1. Faça logout do sistema atual');
    console.log('2. Acesse: http://localhost:8082/auth');
    console.log('3. Login com: superadmin@institutodossonhos.com');
    console.log('4. Senha: superadmin123');
    console.log('5. Agora você terá acesso total a todas as seções!');

    console.log('\n🔗 LINKS IMPORTANTES:');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');
    console.log('📋 Sessões: http://localhost:8082/admin/sessions');
    console.log('🛠️ Ferramentas: http://localhost:8082/tool-management');

    // 4. Mostrar todos os usuários com seus admin_level
    console.log('\n📋 USUÁRIOS E SEUS ADMIN_LEVEL:');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('profiles')
      .select('id, full_name, email, admin_level')
      .order('admin_level', { ascending: false });

    if (!allUsersError && allUsers) {
      allUsers.forEach(user => {
        const level = user.admin_level || 0;
        const status = level >= 999 ? '👑 Super Admin' : level >= 100 ? '🔧 Admin' : '👤 Usuário';
        console.log(`- ${user.full_name} (${user.email}): admin_level = ${level} ${status}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

addAdminLevelColumn(); 