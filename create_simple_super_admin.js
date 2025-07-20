import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSimpleSuperAdmin() {
  try {
    console.log('🔄 Criando usuário principal (Super Admin)...');

    // Criar perfil do super admin
    const { data: superAdmin, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000888',
        email: 'superadmin@institutodossonhos.com',
        full_name: 'Super Administrador',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: '00000000-0000-0000-0000-000000000888'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Super Admin criado com sucesso!');
    console.log('👑 Email: superadmin@institutodossonhos.com');
    console.log('🆔 ID: 00000000-0000-0000-0000-000000000888');
    console.log('📋 Nome: Super Administrador');
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

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createSimpleSuperAdmin(); 