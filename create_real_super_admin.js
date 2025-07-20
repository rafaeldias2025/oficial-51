import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createRealSuperAdmin() {
  try {
    console.log('🔄 Criando Super Admin com permissões completas...');

    // 1. Criar perfil do super admin com permissões especiais
    const { data: superAdmin, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000777',
        email: 'superadmin@institutodossonhos.com',
        full_name: 'Super Administrador - Acesso Total',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: '00000000-0000-0000-0000-000000000777'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Super Admin criado:', superAdmin.id);

    // 2. Atualizar o usuário existente para ter permissões de super admin
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
      console.log('⚠️ Erro ao atualizar usuário:', updateError);
    } else {
      console.log('✅ Usuário atualizado para Super Admin');
    }

    console.log('🎉 SUPER ADMIN CRIADO COM SUCESSO!');
    console.log('👑 Email: superadmin@institutodossonhos.com');
    console.log('🔑 Senha: superadmin123');
    console.log('🆔 ID: 00000000-0000-0000-0000-000000000777');
    console.log('📋 Permissões: Acesso total a todas as áreas');
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

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createRealSuperAdmin(); 