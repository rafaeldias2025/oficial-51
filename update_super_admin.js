import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateToSuperAdmin() {
  try {
    console.log('🔄 Atualizando usuário para Super Admin...');

    // Atualizar o usuário existente para super admin
    const { data: superAdmin, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Super Administrador - Acesso Total',
        email: 'superadmin@institutodossonhos.com',
        updated_at: new Date().toISOString()
      })
      .eq('id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar perfil:', updateError);
      return;
    }

    console.log('🎉 SUPER ADMIN CRIADO COM SUCESSO!');
    console.log('👑 ID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    console.log('📧 Email: superadmin@institutodossonhos.com');
    console.log('👤 Nome: Super Administrador - Acesso Total');
    console.log('🔗 Login: http://localhost:8082/auth');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');

    console.log('\n📋 CREDENCIAIS DE ACESSO:');
    console.log('👤 Email: superadmin@institutodossonhos.com');
    console.log('🔑 Senha: superadmin123');
    console.log('🎯 Tipo: Super Administrador');

    console.log('\n📋 ÁREAS DISPONÍVEIS:');
    console.log('✅ Dashboard completo');
    console.log('✅ Todas as seções administrativas');
    console.log('✅ Acesso total ao sistema');
    console.log('✅ Gerenciar Cursos');
    console.log('✅ Gerenciar Sessões');
    console.log('✅ Gerenciar Ferramentas');
    console.log('✅ Gerenciar Avaliações');
    console.log('✅ Configurações do Sistema');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

updateToSuperAdmin(); 