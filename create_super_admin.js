import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSuperAdmin() {
  try {
    console.log('🔄 Criando usuário principal (Super Admin)...');

    // 1. Criar usuário na tabela users primeiro
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: '00000000-0000-0000-0000-000000000999',
        email: 'admin@institutodossonhos.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Erro ao criar usuário:', userError);
      return;
    }

    console.log('✅ Usuário criado:', user.id);

    // 2. Criar perfil do super admin
    const { data: superAdmin, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000999', // ID único para super admin
        email: 'admin@institutodossonhos.com',
        full_name: 'Administrador Principal',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: '00000000-0000-0000-0000-000000000999'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Perfil do Super Admin criado:', superAdmin.id);

    // 3. Criar credenciais de acesso
    const { data: auth, error: authError } = await supabase
      .from('auth_users')
      .insert({
        id: '00000000-0000-0000-0000-000000000999',
        email: 'admin@institutodossonhos.com',
        password_hash: 'super_admin_2024', // Em produção seria hash real
        role: 'super_admin',
        is_active: true,
        last_login: new Date().toISOString(),
        permissions: JSON.stringify([
          'read_all',
          'write_all',
          'delete_all',
          'admin_all',
          'system_access'
        ])
      })
      .select()
      .single();

    if (authError) {
      console.log('⚠️ Erro ao criar auth (pode já existir):', authError);
    } else {
      console.log('✅ Credenciais do Super Admin criadas:', auth.id);
    }

    // 4. Criar configurações de acesso
    const { data: access, error: accessError } = await supabase
      .from('admin_access')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000999',
        access_level: 'super_admin',
        can_manage_users: true,
        can_manage_admins: true,
        can_manage_system: true,
        can_access_all_sections: true,
        can_create_tools: true,
        can_send_evaluations: true,
        can_manage_courses: true,
        can_view_analytics: true,
        can_export_data: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (accessError) {
      console.log('⚠️ Erro ao criar acesso (pode não existir tabela):', accessError);
    } else {
      console.log('✅ Configurações de acesso criadas:', access.id);
    }

    console.log('🎉 SUPER ADMIN CRIADO COM SUCESSO!');
    console.log('👑 Email: admin@institutodossonhos.com');
    console.log('🔑 Senha: super_admin_2024');
    console.log('🆔 ID: 00000000-0000-0000-0000-000000000999');
    console.log('📋 Permissões: Acesso total a todas as áreas');
    console.log('🔗 Login: http://localhost:8082/auth');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');

    console.log('\n📋 ÁREAS DISPONÍVEIS PARA SUPER ADMIN:');
    console.log('✅ Dashboard completo');
    console.log('✅ Gerenciar Cursos');
    console.log('✅ Gerenciar Sessões');
    console.log('✅ Gerenciar Ferramentas');
    console.log('✅ Gerenciar Avaliações');
    console.log('✅ Configurações do Sistema');
    console.log('✅ Gerenciar Usuários');
    console.log('✅ Gerenciar Admins');
    console.log('✅ Acesso a todas as seções');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createSuperAdmin(); 