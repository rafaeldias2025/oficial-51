import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminPermissions() {
  try {
    console.log('🔄 Configurando permissões de admin corretamente...');

    // 1. Verificar usuários existentes
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);

    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      return;
    }

    console.log('📋 Usuários encontrados:');
    users.forEach(user => {
      console.log(`- ${user.full_name} (${user.email}) - ID: ${user.id}`);
    });

    // 2. Atualizar o usuário principal com permissões corretas
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Super Administrador - Acesso Total',
        email: 'superadmin@institutodossonhos.com',
        // Adicionar metadados de admin
        raw_user_meta_data: {
          is_admin: true,
          can_access_all_sections: true,
          super_admin: true,
          full_access: true,
          permissions: ['dashboard', 'courses', 'sessions', 'tools', 'evaluations', 'system']
        }
      })
      .eq('id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar usuário:', updateError);
      return;
    }

    console.log('✅ Usuário atualizado com permissões de admin');

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

    console.log('🎉 PERMISSÕES DE ADMIN CONFIGURADAS!');
    console.log('👑 Email: superadmin@institutodossonhos.com');
    console.log('🔑 Senha: superadmin123');
    console.log('🆔 ID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    console.log('📋 Nome: Super Administrador - Acesso Total');
    console.log('🔐 raw_user_meta_data configurado com is_admin: true');

    console.log('\n📋 METADADOS CONFIGURADOS:');
    console.log('✅ is_admin: true');
    console.log('✅ can_access_all_sections: true');
    console.log('✅ super_admin: true');
    console.log('✅ full_access: true');
    console.log('✅ permissions: [dashboard, courses, sessions, tools, evaluations, system]');

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

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

fixAdminPermissions(); 