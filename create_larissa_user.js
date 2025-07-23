import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLarissaUser() {
  try {
<<<<<<< HEAD
    console.log('🔄 Criando usuário Larissa...');

    // 1. Criar usuário no sistema de auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'larissa@institutodossonhos.com',
      password: '10203040',
      email_confirm: true,
      user_metadata: {
        full_name: 'Larissa Barbosa'
      }
    });

=======
    console.log('👤 Criando usuário Larissa Barbosa...');
    
    // 1. Criar usuário no auth.users
    console.log('\n🔐 Criando usuário no sistema de autenticação...');
    
    const userId = '00000000-0000-0000-0000-000000000007'; // ID único para Larissa
    
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .insert({
        id: userId,
        email: 'larissa@institutodossonhos.com',
        encrypted_password: '$2a$10$example.hash.for.password.10203040',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
    if (authError) {
      console.error('❌ Erro ao criar usuário no auth:', authError);
      return;
    }

    console.log('✅ Usuário criado no auth:', authData.user.id);

    // 2. Criar perfil na tabela profiles
    const profileData = {
      id: authData.user.id,
      email: 'larissa@institutodossonhos.com',
      full_name: 'Larissa Barbosa',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
<<<<<<< HEAD
      .insert([profileData])
=======
      .insert({
        id: userId,
        email: 'larissa@institutodossonhos.com',
        full_name: 'Larissa Barbosa',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Perfil criado:', profile);

    // 3. Verificar se foi criado corretamente
    const { data: checkUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();

    if (checkError) {
      console.error('❌ Erro ao verificar usuário:', checkError);
      return;
    }

    console.log('🎉 Usuário Larissa criado com sucesso!');
    console.log('📋 Detalhes:');
    console.log(`   - ID: ${checkUser.id}`);
    console.log(`   - Nome: ${checkUser.full_name}`);
    console.log(`   - Email: ${checkUser.email}`);
<<<<<<< HEAD
    console.log('\n🔐 Credenciais de Login:');
=======
    console.log(`   - Criado em: ${checkUser.created_at}`);
    
    console.log('\n🎉 Usuário Larissa Barbosa criado com sucesso!');
    console.log('🔑 Credenciais de login:');
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
    console.log('   - Email: larissa@institutodossonhos.com');
    console.log('   - Senha: 10203040');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
createLarissaUser(); 