import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySuperAdmin() {
  try {
    console.log('🔍 Verificando Super Admin...');

    // 1. Verificar perfil do super admin
    const { data: superAdmin, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .single();

    if (profileError) {
      console.error('❌ Erro ao buscar super admin:', profileError);
      return;
    }

    console.log('✅ SUPER ADMIN ENCONTRADO!');
    console.log('👑 ID:', superAdmin.id);
    console.log('📧 Email:', superAdmin.email);
    console.log('📋 Nome:', superAdmin.full_name);
    console.log('🔐 admin_level:', superAdmin.admin_level);
    console.log('📅 Criado em:', superAdmin.created_at);

    // 2. Verificar todos os usuários com admin_level
    console.log('\n📋 TODOS OS USUÁRIOS E SEUS ADMIN_LEVEL:');
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

    console.log('\n🎉 SUPER ADMIN CONFIGURADO COM SUCESSO!');
    console.log('🔑 Credenciais de Login:');
    console.log('   Email: superadmin@institutodossonhos.com');
    console.log('   Senha: superadmin123');
    console.log('   admin_level: 999 (Super Admin)');

    console.log('\n🔗 LINKS IMPORTANTES:');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');
    console.log('📋 Sessões: http://localhost:8082/admin/sessions');
    console.log('🛠️ Ferramentas: http://localhost:8082/tool-management');

    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('1. Faça logout do sistema atual');
    console.log('2. Acesse: http://localhost:8082/auth');
    console.log('3. Login com: superadmin@institutodossonhos.com');
    console.log('4. Senha: superadmin123');
    console.log('5. Agora você terá acesso total a todas as seções!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

verifySuperAdmin(); 