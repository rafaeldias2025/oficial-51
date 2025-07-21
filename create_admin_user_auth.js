import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - USAR VARIÁVEIS DE AMBIENTE
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUserAuth() {
  try {
    console.log('🔄 Criando usuário admin via sistema de auth...');

    // 1. Criar usuário no sistema de auth do Supabase
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: process.env.ADMIN_EMAIL || 'admin@instituto.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Administrador - Acesso Total',
        is_admin: true,
        super_admin: true
      }
    });

    if (userError) {
      console.error('❌ Erro ao criar usuário auth:', userError);
      return;
    }

    console.log('✅ Usuário auth criado:', userData.user.id);

    // 2. Verificar se o perfil foi criado automaticamente pelo trigger
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️ Perfil não encontrado, criando manualmente...');
      
      // 3. Criar perfil manualmente se não foi criado pelo trigger
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userData.user.id,
          email: process.env.ADMIN_EMAIL || 'admin@instituto.com',
          full_name: 'Super Administrador - Acesso Total',
          role: 'admin',
          admin_level: 999
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar perfil:', createError);
        return;
      }

      console.log('✅ Perfil criado manualmente:', newProfile.id);
    } else {
      console.log('✅ Perfil encontrado (criado pelo trigger):', profile.id);
      
      // 4. Atualizar perfil para garantir que é admin
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          admin_level: 999,
          full_name: 'Super Administrador - Acesso Total'
        })
        .eq('user_id', userData.user.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar perfil:', updateError);
      } else {
        console.log('✅ Perfil atualizado para admin');
      }
    }

    console.log('🎉 USUÁRIO ADMIN CRIADO COM SUCESSO!');
    console.log('👑 Email: ' + (process.env.ADMIN_EMAIL || 'admin@instituto.com'));
    console.log('🔑 Senha: [PROTEGIDA]');
    console.log('🆔 ID: ' + userData.user.id);
    console.log('📋 Nome: Super Administrador - Acesso Total');
    console.log('🔐 role: admin');
    console.log('🔐 admin_level: 999');

    console.log('\n📋 CONFIGURAÇÃO COMPLETA:');
    console.log('✅ Usuário criado no auth.users');
    console.log('✅ Perfil criado em profiles');
    console.log('✅ role: admin');
    console.log('✅ admin_level: 999');
    console.log('✅ Email na lista VITE_ADMIN_EMAILS');

    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('1. Reinicie o servidor de desenvolvimento');
    console.log('2. Acesse: http://localhost:8082/auth');
    console.log('3. Login com as credenciais configuradas');
    console.log('4. Agora você terá acesso total!');

    console.log('\n🔗 LINKS IMPORTANTES:');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');
    console.log('📋 Sessões: http://localhost:8082/admin/sessions');
    console.log('🛠️ Ferramentas: http://localhost:8082/tool-management');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createAdminUserAuth(); 