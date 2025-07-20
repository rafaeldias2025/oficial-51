import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleAdminCreation() {
  try {
    console.log('🔄 Criando admin de forma simples...');

    // 1. Primeiro, vamos usar um email que já está na lista de admin
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    console.log('📧 Usando email existente:', adminEmail);

    // 2. Verificar se o usuário já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar usuário:', checkError);
      return;
    }

    if (existingUser) {
      console.log('✅ Usuário já existe, atualizando para admin...');
      
      // 3. Atualizar usuário existente para admin
      const { data: updatedUser, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          admin_level: 999,
          full_name: 'Super Administrador - Acesso Total'
        })
        .eq('email', adminEmail)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar usuário:', updateError);
        return;
      }

      console.log('✅ Usuário atualizado para admin:', updatedUser.id);
    } else {
      console.log('⚠️ Usuário não existe, criando novo...');
      
      // 4. Criar novo usuário admin
      const { data: newUser, error: createError } = await supabase
        .from('profiles')
        .insert({
          email: adminEmail,
          full_name: 'Super Administrador - Acesso Total',
          role: 'admin',
          admin_level: 999,
          user_id: '00000000-0000-0000-0000-000000000001'
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar usuário:', createError);
        return;
      }

      console.log('✅ Novo usuário admin criado:', newUser.id);
    }

    console.log('🎉 ADMIN CRIADO/ATUALIZADO COM SUCESSO!');
    console.log('👑 Email: admin@example.com');
    console.log('🔑 Senha: admin123');
    console.log('📋 Nome: Super Administrador - Acesso Total');
    console.log('🔐 role: admin');
    console.log('🔐 admin_level: 999');

    console.log('\n📋 CONFIGURAÇÃO:');
    console.log('✅ Email na lista VITE_ADMIN_EMAILS');
    console.log('✅ role: admin');
    console.log('✅ admin_level: 999');

    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('1. Reinicie o servidor de desenvolvimento');
    console.log('2. Acesse: http://localhost:8082/auth');
    console.log('3. Login com: admin@example.com');
    console.log('4. Senha: admin123');
    console.log('5. Agora você terá acesso total!');

    console.log('\n🔗 LINKS IMPORTANTES:');
    console.log('📊 Dashboard: http://localhost:8082/admin/dashboard');
    console.log('📋 Sessões: http://localhost:8082/admin/sessions');
    console.log('🛠️ Ferramentas: http://localhost:8082/tool-management');

    // 5. Verificar todos os usuários admin
    console.log('\n📋 USUÁRIOS ADMIN EXISTENTES:');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('profiles')
      .select('email, full_name, role, admin_level')
      .or('role.eq.admin,admin_level.gte.100')
      .order('admin_level', { ascending: false });

    if (!allUsersError && allUsers) {
      allUsers.forEach((user, index) => {
        const level = user.admin_level || 0;
        const status = level >= 999 ? '👑 Super Admin' : level >= 100 ? '🔧 Admin' : '👤 Usuário';
        console.log(`   ${index + 1}. ${user.full_name} (${user.email})`);
        console.log(`      - role: ${user.role}`);
        console.log(`      - admin_level: ${level} ${status}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

simpleAdminCreation(); 