import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testUserCreation() {
  console.log('🧪 Testando criação de usuário...');
  
  try {
    // 1. Primeiro, vamos verificar se o trigger existe
    console.log('📋 Verificando trigger...');
    const { data: triggerCheck, error: triggerError } = await supabase
      .rpc('get_trigger_info', { trigger_name: 'on_auth_user_created' });
    
    if (triggerError) {
      console.log('❌ Erro ao verificar trigger:', triggerError);
      console.log('🔍 Tentando verificar via SQL direto...');
    } else {
      console.log('✅ Trigger encontrado:', triggerCheck);
    }

    // 2. Vamos verificar usuários existentes
    console.log('👥 Verificando usuários existentes...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erro ao listar usuários:', usersError);
    } else {
      console.log(`📊 Total de usuários: ${users.users.length}`);
      users.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`);
      });
    }

    // 3. Vamos verificar perfis existentes
    console.log('👤 Verificando perfis existentes...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erro ao listar perfis:', profilesError);
    } else {
      console.log(`📊 Total de perfis: ${profiles.length}`);
      profiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.user_id}) - Role: ${profile.role}`);
      });
    }

    // 4. Vamos verificar se há usuários sem perfil
    if (users.users.length > 0 && profiles.length > 0) {
      const usersWithoutProfile = users.users.filter(user => 
        !profiles.find(profile => profile.user_id === user.id)
      );
      
      if (usersWithoutProfile.length > 0) {
        console.log('⚠️  Usuários sem perfil encontrados:');
        usersWithoutProfile.forEach(user => {
          console.log(`  - ${user.email} (${user.id})`);
        });
      } else {
        console.log('✅ Todos os usuários têm perfil');
      }
    }

    // 5. Vamos tentar criar um usuário de teste
    console.log('🔄 Tentando criar usuário de teste...');
    const testEmail = `teste-${Date.now()}@exemplo.com`;
    const testPassword = 'Teste123!';
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Usuário Teste',
        role: 'client'
      }
    });
    
    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError);
    } else {
      console.log('✅ Usuário criado:', newUser.user.email);
      
      // 6. Vamos verificar se o perfil foi criado automaticamente
      setTimeout(async () => {
        console.log('🔍 Verificando se o perfil foi criado...');
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', newUser.user.id)
          .single();
        
        if (profileError) {
          console.error('❌ Erro ao verificar perfil:', profileError);
          console.log('🔧 Tentando criar perfil manualmente...');
          
          // Tentar criar o perfil manualmente
          const { data: manualProfile, error: manualError } = await supabase
            .from('profiles')
            .insert({
              user_id: newUser.user.id,
              email: newUser.user.email,
              full_name: 'Usuário Teste',
              role: 'client',
              celular: ''
            })
            .select()
            .single();
          
          if (manualError) {
            console.error('❌ Erro ao criar perfil manualmente:', manualError);
          } else {
            console.log('✅ Perfil criado manualmente:', manualProfile);
          }
        } else {
          console.log('✅ Perfil criado automaticamente:', newProfile);
        }
      }, 2000);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testUserCreation(); 