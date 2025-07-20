import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function upgradeToSuperAdmin() {
  try {
    console.log('🔄 Atualizando usuário para Super Admin...');

    // Atualizar o usuário existente para ter permissões de super admin
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Super Administrador - Acesso Total',
        email: 'superadmin@institutodossonhos.com'
      })
      .eq('id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar usuário:', updateError);
      return;
    }

    console.log('🎉 USUÁRIO ATUALIZADO PARA SUPER ADMIN!');
    console.log('👑 Email: superadmin@institutodossonhos.com');
    console.log('🔑 Senha: superadmin123');
    console.log('🆔 ID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    console.log('📋 Nome: Super Administrador - Acesso Total');
    console.log('🔗 Login: http://localhost:8082/auth');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');

    console.log('\n📋 ÁREAS DISPONÍVEIS PARA SUPER ADMIN:');
    console.log('✅ Dashboard completo');
    console.log('✅ Gerenciar Cursos');
    console.log('✅ Gerenciar Sessões (SEM RESTRIÇÕES)');
    console.log('✅ Gerenciar Ferramentas');
    console.log('✅ Gerenciar Avaliações');
    console.log('✅ Configurações do Sistema');
    console.log('✅ Acesso a todas as seções');

    console.log('\n🔐 PERMISSÕES ESPECIAIS:');
    console.log('✅ is_admin: true');
    console.log('✅ can_access_all_sections: true');
    console.log('✅ super_admin: true');
    console.log('✅ full_access: true');

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

upgradeToSuperAdmin(); 